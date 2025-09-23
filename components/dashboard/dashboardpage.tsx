import React from "react";
import PostComposer from "@/components/post-composer";
import Feed from "@/components/feed";
import UserStoreInitializer from "@/components/user-store-initializer";
import { getUserServer } from "@/lib/getUserServer";

const DashboardPage: React.FC = async () => {
  const user = await getUserServer();

  return (
    <>
      <UserStoreInitializer user={user} />
      <div className="min-h-screen bg-gradient-to-br lg:px-4 from-background via-background to-secondaryBg/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Feed Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Composer Section */}
              <div className="sticky z-10">
                <PostComposer user={user} />
              </div>

              {/* Feed Section */}
              <div className="relative">
                <Feed />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky space-y-4">
                {/* Trending Widget */}
                <div
                  className="rounded-2xl border backdrop-blur-sm p-6 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--secondaryBg) 0%, var(--background) 100%)",
                    borderColor: "var(--sidebar-border)",
                  }}
                >
                  <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muzupColor animate-pulse"></div>
                    Trending Now
                  </h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-all cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium text-textColor">
                            #TrendingTopic{i}
                          </div>
                          <div className="text-xs text-subTextColor">
                            {20}K posts
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muzupColor/10 flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-muzupColor"
                          >
                            <path
                              d="M7 17L17 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7 7h10v10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions Widget */}
                <div
                  className="rounded-2xl border backdrop-blur-sm p-6 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--secondaryBg) 0%, var(--background) 100%)",
                    borderColor: "var(--sidebar-border)",
                  }}
                >
                  <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    Who to Follow
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-background/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muzupColor to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          U{i}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-textColor truncate">
                            User {i}
                          </div>
                          <div className="text-xs text-subTextColor">
                            @user{i}
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-muzupColor text-white text-xs font-medium rounded-lg hover:bg-muzupColor/90 transition-colors">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div
                  className="rounded-2xl border backdrop-blur-sm p-6 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--secondaryBg) 0%, var(--background) 100%)",
                    borderColor: "var(--sidebar-border)",
                  }}
                >
                  <h3 className="text-lg font-semibold text-textColor mb-4">
                    Your Activity
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-background/30">
                      <div className="text-xl font-bold text-muzupColor">
                        24
                      </div>
                      <div className="text-xs text-subTextColor">Posts</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-background/30">
                      <div className="text-xl font-bold text-blue-500">156</div>
                      <div className="text-xs text-subTextColor">Following</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
