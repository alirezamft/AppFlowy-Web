import { AxiosError } from 'axios';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  DomainOverviewResponse,
  getPortfolioOverview,
  ProductOverviewItem,
} from '@/application/services/js-services/http/portfolio-api';
import { ReactComponent as ChartIcon } from '@/assets/icons/chart.svg';
import { useCurrentWorkspaceId } from '@/components/app/app.hooks';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type OverviewState =
  | { status: 'loading' }
  | { status: 'ready'; data: DomainOverviewResponse }
  | { status: 'empty' }
  | { status: 'error' };

const PRODUCT_COLOR_TOKENS: Record<string, string> = {
  'tag-01': 'var(--tag-fill-01-thick)',
  'tag-02': 'var(--tag-fill-02-thick)',
  'tag-03': 'var(--tag-fill-03-thick)',
  'tag-04': 'var(--tag-fill-04-thick)',
  'tag-05': 'var(--tag-fill-05-thick)',
  'tag-06': 'var(--tag-fill-06-thick)',
};

const PRODUCT_COLOR_FALLBACKS = Object.values(PRODUCT_COLOR_TOKENS);

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

function getProductColor(product: ProductOverviewItem): string {
  const configured = PRODUCT_COLOR_TOKENS[product.color_token];

  if (configured) return configured;

  const hash = [...product.product_key].reduce((value, character) => value + character.charCodeAt(0), 0);

  return PRODUCT_COLOR_FALLBACKS[hash % PRODUCT_COLOR_FALLBACKS.length];
}

function PortfolioOverviewPage() {
  const workspaceId = useCurrentWorkspaceId();
  const { t } = useTranslation();
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<OverviewState>({ status: 'loading' });

  useEffect(() => {
    if (!workspaceId) {
      setState({ status: 'error' });
      return;
    }

    let cancelled = false;

    setState({ status: 'loading' });
    void getPortfolioOverview(workspaceId)
      .then((data) => {
        if (cancelled) return;
        setState(data.products.length === 0 ? { status: 'empty' } : { status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const status = error instanceof AxiosError ? error.response?.status : undefined;

        setState(status === 404 ? { status: 'empty' } : { status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, workspaceId]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return (
    <section className='h-[calc(100vh-48px)] overflow-y-auto bg-background-primary' aria-labelledby='portfolio-title'>
      <div className='mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-10'>
        <header className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex items-start gap-3'>
            <div className='mt-0.5 rounded-300 bg-fill-theme-select p-2 text-text-action'>
              <ChartIcon className='h-5 w-5' aria-hidden='true' />
            </div>
            <div>
              <h1 id='portfolio-title' className='text-2xl font-semibold text-text-primary'>
                {t('portfolio.overview.title')}
              </h1>
              <p className='mt-1 text-sm text-text-secondary'>{t('portfolio.overview.subtitle')}</p>
            </div>
          </div>
          <div className='flex items-center gap-2 text-xs text-text-secondary'>
            {state.status === 'ready' ? (
              <span className='rounded-full bg-fill-content px-3 py-1'>
                {t('portfolio.overview.schema', { version: state.data.schema_version })}
              </span>
            ) : null}
            <a
              className='rounded-full px-3 py-1 text-text-action hover:bg-fill-content focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-theme-thick'
              href='https://github.com/alirezamft/AppFlowy-Web'
              target='_blank'
              rel='noreferrer'
            >
              {t('portfolio.overview.source')}
            </a>
          </div>
        </header>

        {state.status === 'loading' ? <LoadingState /> : null}
        {state.status === 'empty' ? <EmptyState onRetry={reload} /> : null}
        {state.status === 'error' ? <ErrorState onRetry={reload} /> : null}
        {state.status === 'ready' ? <OverviewContent data={state.data} /> : null}
      </div>
    </section>
  );
}

function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-[320px] items-center justify-center gap-3 text-sm text-text-secondary'>
      <Progress variant='inherit' />
      <span>{t('portfolio.overview.loading')}</span>
    </div>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-[320px] flex-col items-center justify-center rounded-400 border border-border-primary bg-surface-container-layer-01 px-6 text-center'>
      <ChartIcon className='mb-4 h-10 w-10 text-icon-secondary' aria-hidden='true' />
      <h2 className='text-lg font-medium text-text-primary'>{t('portfolio.overview.emptyTitle')}</h2>
      <p className='mt-2 max-w-xl text-sm leading-6 text-text-secondary'>{t('portfolio.overview.emptyDescription')}</p>
      <Button className='mt-5' variant='outline' onClick={onRetry}>
        {t('portfolio.overview.retry')}
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div
      role='alert'
      className='flex min-h-[320px] flex-col items-center justify-center rounded-400 border border-border-primary px-6 text-center'
    >
      <h2 className='text-lg font-medium text-text-primary'>{t('portfolio.overview.errorTitle')}</h2>
      <p className='mt-2 max-w-xl text-sm leading-6 text-text-secondary'>{t('portfolio.overview.errorDescription')}</p>
      <Button className='mt-5' onClick={onRetry}>
        {t('portfolio.overview.retry')}
      </Button>
    </div>
  );
}

function OverviewContent({ data }: { data: DomainOverviewResponse }) {
  const { t } = useTranslation();

  return (
    <>
      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
        <SummaryCard
          label={t('portfolio.overview.domainProgress')}
          value={`${Math.round(clampPercent(data.delivery.progress_percent))}%`}
          caption={t('portfolio.overview.deliveryCount', {
            done: data.delivery.done_leaf_count,
            total: data.delivery.in_scope_leaf_count,
          })}
        />
        <SummaryCard label={t('portfolio.overview.atRisk')} value={data.at_risk_initiative_count.toString()} />
        <SummaryCard label={t('portfolio.overview.offTrack')} value={data.off_track_initiative_count.toString()} />
        <SummaryCard
          label={t('portfolio.overview.criticalBlockers')}
          value={data.open_critical_blocker_count.toString()}
        />
        <SummaryCard
          label={t('portfolio.overview.criticalDependencies')}
          value={data.critical_dependency_count.toString()}
        />
      </div>

      <div>
        <h2 className='mb-3 text-base font-medium text-text-primary'>{t('portfolio.overview.products')}</h2>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {data.products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

const SummaryCard = memo(function SummaryCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <article className='rounded-400 border border-border-primary bg-surface-container-layer-01 p-4'>
      <p className='text-xs font-medium text-text-secondary'>{label}</p>
      <p className='mt-2 text-2xl font-semibold tabular-nums text-text-primary'>{value}</p>
      {caption ? <p className='mt-1 text-xs text-text-tertiary'>{caption}</p> : null}
    </article>
  );
});

const ProductCard = memo(function ProductCard({ product }: { product: ProductOverviewItem }) {
  const { t } = useTranslation();
  const progress = clampPercent(product.delivery.progress_percent);
  const color = getProductColor(product);

  return (
    <article className='rounded-400 border border-border-primary bg-surface-container-layer-01 p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='h-2.5 w-2.5 shrink-0 rounded-full' style={{ backgroundColor: color }} />
            <h3 className='truncate text-sm font-medium text-text-primary'>{product.name}</h3>
          </div>
          <p className='mt-1 text-xs text-text-tertiary'>{t(`portfolio.health.${product.health}`)}</p>
        </div>
        <span className='text-lg font-semibold tabular-nums text-text-primary'>{Math.round(progress)}%</span>
      </div>

      <div
        className='mt-4 h-1.5 overflow-hidden rounded-full bg-fill-content'
        role='progressbar'
        aria-label={t('portfolio.overview.deliveryProgressFor', { product: product.name })}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className='h-full rounded-full transition-[width]' style={{ backgroundColor: color, width: `${progress}%` }} />
      </div>

      <div className='mt-4 flex items-end justify-between gap-4 border-t border-border-primary pt-3'>
        <div>
          <p className='text-xs text-text-tertiary'>{t('portfolio.overview.outcome')}</p>
          <p className='mt-1 truncate text-sm text-text-primary'>{product.outcome?.name || '—'}</p>
        </div>
        <p className='shrink-0 text-sm font-medium tabular-nums text-text-primary'>
          {product.outcome?.value ?? '—'} {product.outcome?.unit || ''}
        </p>
      </div>
    </article>
  );
});

export default memo(PortfolioOverviewPage);
