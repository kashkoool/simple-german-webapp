import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/** Chevron separator for breadcrumbs */
function Separator() {
  return (
    <span
      className="text-stone-400 dark:text-stone-500 select-none mx-0.5 shrink-0 transition-colors duration-200"
      aria-hidden
    >
      /
    </span>
  );
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-stone-500 dark:text-stone-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-x-1.5">
              {index > 0 && <Separator />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded px-2 py-2.5 min-h-[44px] inline-flex items-center text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 focus-visible:rounded touch-manipulation"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-56 sm:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
