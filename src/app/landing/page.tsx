import Footer from '@/components/Footer'
import LandingPage from '@/components/LandingPage'
import connectDb from '@/lib/db'
import { auth } from '@/auth'
import User from '@/models/user.model'
import Grocery, { IGrocery } from '@/models/grocery.model'

const Landing = async () => {
  await connectDb()
  const session = await auth()
  const user = session?.user?.id ? await User.findById(session.user.id) : null
  const plainUser = user ? JSON.parse(JSON.stringify(user)) : null

  const groceryDocs = await Grocery.find({}).lean()
  const groceryList = groceryDocs.map((item) => ({
    ...item,
    _id: item._id?.toString(),
  })) as IGrocery[]

  return (
    <>
      <LandingPage user={plainUser} groceryList={groceryList} />
      <Footer/>
    </>

  )
}

export default Landing
