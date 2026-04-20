"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

interface CollapsibleListProps<T> {
  items: T[];
  max?: number;
  keyExtractor?: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}

export function CollapsibleList<T>({
  items,
  max = 3,
  keyExtractor,
  renderItem,
}: CollapsibleListProps<T>) {
  return (
    <Collapsible.Root>
      {/* Show initial items */}
      {items.slice(0, max).map((item, index) => (
        <div
          key={typeof keyExtractor === "function" ? keyExtractor(item) : index}
          className="border-b border-gray-200 dark:border-gray-800 last:border-b-0"
        >
          {renderItem(item)}
        </div>
      ))}

      {/* Collapsible additional items */}
      <Collapsible.Content>
        {items.slice(max).map((item, index) => (
          <div
            key={
              typeof keyExtractor === "function"
                ? keyExtractor(item)
                : max + index
            }
            className="border-b border-gray-200 dark:border-gray-800 last:border-b-0"
          >
            {renderItem(item)}
          </div>
        ))}
      </Collapsible.Content>

      {/* Show More/Less Button */}
      {items.length > max && (
        <div className="flex h-12 items-center justify-center border-t border-gray-200 dark:border-gray-800">
          <Collapsible.Trigger asChild>
            <button className="group/collapsible-trigger inline-flex items-center font-mono gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <span className="hidden group-data-[state=closed]/collapsible-trigger:block">
                Show {items.length - max} more
              </span>
              <span className="hidden group-data-[state=open]/collapsible-trigger:block">
                Show less
              </span>
              <ChevronDown
                className="size-3.5 group-data-[state=open]/collapsible-trigger:rotate-180 transition-transform"
                aria-hidden
              />
            </button>
          </Collapsible.Trigger>
        </div>
      )}
    </Collapsible.Root>
  );
}
