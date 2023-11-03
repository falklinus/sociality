import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <UserPosts />
        <CreatePost />
      </div>
    </main>
  );
}

async function UserPosts() {
  const posts = await api.post.bySessionUser.query();

  return (
    <div className="w-full max-w-xs">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="mb-2 rounded bg-white/10 p-4">
            <h2 className="text-lg">{post.title}</h2>
            <p>{post.content}</p>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        ))
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  );
}

function timeAgo(timestamp: Date, locale = "en") {
  let value;
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (years > 0) {
    value = rtf.format(0 - years, "year");
  } else if (months > 0) {
    value = rtf.format(0 - months, "month");
  } else if (days > 0) {
    value = rtf.format(0 - days, "day");
  } else if (hours > 0) {
    value = rtf.format(0 - hours, "hour");
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, "minute");
  } else {
    value = rtf.format(0 - diff, "second");
  }
  return value;
}
