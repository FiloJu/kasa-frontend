import { redirect } from "next/navigation";

/** Redirects the root route to the home page. */
export default function Home() {
  redirect("/home");
}