import { useTranslation } from 'react-i18next';

import { DomainOverviewResponse } from '@/application/services/js-services/http/portfolio-api';
import { ReactComponent as ChartIcon } from '@/assets/icons/chart.svg';
import { Button } from '@/components/ui/button';
import { PortfolioOverviewContent } from '@/pages/PortfolioOverviewPage';

const PREVIEW_DATA: DomainOverviewResponse = {
  api_version: 'v1',
  schema_version: 'trade-portfolio/v1',
  workspace_id: '00000000-0000-0000-0000-000000000001',
  delivery: { done_leaf_count: 91, in_scope_leaf_count: 148, progress_percent: 61.5 },
  at_risk_initiative_count: 3,
  off_track_initiative_count: 1,
  open_critical_blocker_count: 2,
  critical_dependency_count: 4,
  projection_updated_at: new Date().toISOString(),
  products: [
    ['advanced-market', 'بازار پیشرفته', 'tag-01', 'ON_TRACK', 72, 'نرخ تکمیل سفارش', 96.4, '٪'],
    ['otc', 'OTC', 'tag-02', 'AT_RISK', 58, 'حجم معامله', 38.2, 'میلیارد'],
    ['balance', 'تراز', 'tag-03', 'ON_TRACK', 67, 'مغایرت روزانه', 0.08, '٪'],
    ['pricer-watchlist', 'پرایسر و دیده‌بان', 'tag-04', 'OFF_TRACK', 43, 'دقت قیمت', 98.1, '٪'],
    ['partner-api', 'API همکاران', 'tag-05', 'AT_RISK', 55, 'پایداری API', 99.91, '٪'],
    ['partner-app', 'نرم‌افزار همکاران', 'tag-06', 'ON_TRACK', 74, 'کاربر فعال', 1840, 'نفر'],
  ].map(([product_key, name, color_token, health, progress_percent, metricName, value, unit], index) => ({
    product_id: `00000000-0000-0000-0000-00000000010${index}`,
    product_key: String(product_key),
    name: String(name),
    color_token: String(color_token),
    health: health as 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK',
    delivery: {
      done_leaf_count: Math.round(Number(progress_percent) * 0.32),
      in_scope_leaf_count: 32,
      progress_percent: Number(progress_percent),
    },
    outcome: { name: String(metricName), value: Number(value), unit: String(unit), target_value: null },
  })),
};

export default function PortfolioPreviewPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className='flex h-screen w-screen overflow-hidden bg-background-primary text-text-primary'>
      <aside className='hidden w-[260px] shrink-0 border-e border-border-primary bg-surface-container-layer-00 p-3 md:flex md:flex-col'>
        <div className='px-3 py-2 text-sm font-semibold'>Trade Domain</div>
        <button
          type='button'
          className='mt-3 flex h-8 items-center gap-2 rounded-300 bg-fill-list-active px-3 text-sm'
        >
          <ChartIcon className='h-5 w-5' aria-hidden='true' />
          {t('portfolio.sidebar')}
        </button>
        <p className='mt-6 px-3 text-xs text-text-tertiary'>WORKSPACE</p>
        {['بازار پیشرفته', 'OTC', 'تراز', 'پرایسر و دیده‌بان', 'API همکاران', 'نرم‌افزار همکاران'].map(
          (name) => (
            <div key={name} className='mt-1 truncate rounded-300 px-3 py-1.5 text-sm text-text-secondary'>
              {name}
            </div>
          )
        )}
        <div className='mt-auto border-t border-border-primary px-3 pt-3 text-xs text-text-tertiary'>
          Local visual preview
        </div>
      </aside>

      <main className='min-w-0 flex-1 overflow-y-auto'>
        <div className='sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border-primary bg-background-primary px-6'>
          <span className='text-sm text-text-secondary'>{t('portfolio.overview.title')}</span>
          <div className='flex gap-2'>
            <Button size='sm' variant={i18n.language.startsWith('fa') ? 'default' : 'outline'} onClick={() => i18n.changeLanguage('fa')}>
              فارسی
            </Button>
            <Button size='sm' variant={i18n.language.startsWith('en') ? 'default' : 'outline'} onClick={() => i18n.changeLanguage('en')}>
              English
            </Button>
          </div>
        </div>

        <section className='mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-10'>
          <header>
            <h1 className='text-2xl font-semibold'>{t('portfolio.overview.title')}</h1>
            <p className='mt-1 text-sm text-text-secondary'>{t('portfolio.overview.subtitle')}</p>
          </header>
          <PortfolioOverviewContent data={PREVIEW_DATA} />
        </section>
      </main>
    </div>
  );
}

