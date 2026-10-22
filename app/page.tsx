import Header from "@/components/Header";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/home");
}