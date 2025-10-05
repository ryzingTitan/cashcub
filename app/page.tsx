import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/budgets");
  } else {
    redirect("/api/auth/signin");
  }

  // return (
  //     <main>
  //         <h1>Welcome to the Site</h1>
  //         <p>Please sign in to continue.</p>
  //         {/* Add your sign-in button here */}
  //     </main>
  // );
}
