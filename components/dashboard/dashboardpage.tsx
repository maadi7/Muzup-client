// components/dashboard/dashboardpage.tsx (updated)
"use client";

import React, { useCallback, useState } from "react";
import PostComposer from "@/components/post-composer";
import Feed from "@/components/feed";

const DashboardPage: React.FC = () => {
  // incrementing signal triggers feed refetch (fresh first page)
  const [refetchSignal, setRefetchSignal] = useState(0);

  const handlePostCreated = useCallback(() => {
    setRefetchSignal((s) => s + 1);
  }, []);

  return (
    <div className="px-4 text-textColor">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2 space-y-4">
          <PostComposer onPostCreated={handlePostCreated} />
          <Feed onRefetchSignal={refetchSignal} />
        </div>

        <aside className="col-span-3 lg:col-span-1">
          <div className="bg-background border border-border/20 rounded-lg p-4 h-full">
            <div className="text-subTextColor">Right column (widgets/profile) — blank for now</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
