import connectDb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/models/user.model";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Grocery, { IGrocery } from "@/models/grocery.model";
import ProductsPageClient from "@/components/ProductsPageClient";

export default async function ProductsPage() {
  await connectDb();
  const session = await auth();
  const user = session?.user?.id ? await User.findById(session.user.id) : null;
  const plainUser = user ? JSON.parse(JSON.stringify(user)) : null;

  const groceryDocs = await Grocery.find({}).lean();
  const groceryList = groceryDocs.map((item) => ({
    ...item,
    _id: item._id?.toString(),
  })) as IGrocery[];

  return (
    <>
      <Nav user={plainUser} />
      <ProductsPageClient groceryList={groceryList} role={plainUser?.role} />
      <Footer />
    </>
  );
}
