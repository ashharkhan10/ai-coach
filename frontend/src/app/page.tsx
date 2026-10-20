/**
 * Home page — for now it just sends the user to the workout setup.
 * (Login comes in milestone 5.)
 */
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/workout");
}
