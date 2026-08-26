import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as ChartIcon } from '@/assets/icons/chart.svg';
import { useCurrentWorkspaceId } from '@/components/app/app.hooks';
import { cn } from '@/lib/utils';

export function PortfolioSidebarItem() {
  const workspaceId = useCurrentWorkspaceId();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const href = `/app/${workspaceId}/portfolio`;
  const selected = location.pathname.startsWith(href);

  return (
    <button
      type='button'
      aria-current={selected ? 'page' : undefined}
      className={cn(
        'mx-1 flex h-8 items-center gap-2 rounded-300 px-3 text-sm text-text-primary outline-none',
        'hover:bg-fill-list-hover focus-visible:ring-1 focus-visible:ring-border-theme-thick',
        selected && 'bg-fill-list-active'
      )}
      onClick={() => navigate(href)}
    >
      <ChartIcon className='h-5 w-5 shrink-0 text-icon-primary' aria-hidden='true' />
      <span className='truncate'>{t('portfolio.sidebar')}</span>
    </button>
  );
}

