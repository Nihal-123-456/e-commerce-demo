import connectDb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/models/user.model";
import EditRoleMobile from "@/components/EditRoleMobile";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import GeoUpdater from "@/components/GeoUpdater";
import DeliveryMan from "@/components/DeliveryMan";
import Grocery, { IGrocery } from "@/models/grocery.model";
import Footer from "@/components/Footer";
import LandingPage from "@/components/LandingPage";

export default async function Home(props:{
  searchParams: Promise<{q: string}>
}) {
  const searchParams = await props.searchParams

  await connectDb();
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <>
        <LandingPage />
        <Footer />
      </>
    );
  }

  const user = await User.findById(session.user.id);
  if (!user) {
    return (
      <>
        <LandingPage />
        <Footer />
      </>
    );
  }

  const incomplete =
    !user.role || !user.mobile || (!user.mobile && user.role == "user");
  if (incomplete) {
    return <EditRoleMobile />;
  }
  const plainUser = JSON.parse(JSON.stringify(user))

  let groceryList:IGrocery[] = []
  if(user.role === "user") {
    const query = searchParams.q?.trim()

    const groceryDocs = query
      ? await Grocery.find({
          $or:[
            {name: {$regex: query, $options: "i"}},
            {category: {$regex: query, $options: "i"}}
          ]
        }).lean()
      : await Grocery.find({}).lean()

    groceryList = groceryDocs.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    })) as IGrocery[]
  }

  return (
    <>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id}/>
      {user.role == "user" ? (
        <UserDashboard groceryList={groceryList}/>
      ): user.role == "admin" ? (
        <AdminDashboard/>
      ): <DeliveryMan/>}
      <Footer/>
    </>
  );
}
