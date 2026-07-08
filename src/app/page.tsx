import connectDb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import EditRoleMobile from "@/components/EditRoleMobile";

export default async function Home() {
  await connectDb()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if(!user){
    redirect("/login")
  }

  const incomplete = !user.role || !user.mobile || (!user.mobile && user.role == "user")
  if(incomplete){
    return <EditRoleMobile />
  }
}