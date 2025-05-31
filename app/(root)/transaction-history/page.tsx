import HeaderBox from '@/components/HeaderBox'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';


export const dynamic = 'force-dynamic'; // Add this line
interface Props {
  searchParams: {
    id?: string;
    page?: string;
  }
}

const TransactionHistory = async ({ searchParams }: Props) => {
  // Properly destructure searchParams inside the function body
  const { id, page } = await searchParams;
  const currentPage = Number(page) || 1;
  
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return <div>User not logged in</div>;

  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts || !accounts.data) return <div>No accounts found</div>;

  // Use the provided ID or fallback to first account
  const appwriteItemId = id || accounts.data[0]?.appwriteItemId;
  if (!appwriteItemId) return <div>No valid account ID</div>;

  const account = await getAccount({ appwriteItemId });
  if (!account) return <div>Account details not found</div>;

  return (
    <div className='transactions'>
      <div className='transactions-header'>
        <HeaderBox 
          title='Transaction History' 
          subtext='See your bank details and transactions.' 
        />
      </div>
      <div className='space-y-6'>
        <div className='transactions-account'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-18 font-bold text-white'>{account.data.name}</h2>
            <p className='text-14 text-blue-25'>
              {account.data.officialName}
            </p>
            <p className='text-14 text-blue-25'>
              Account ID: {appwriteItemId}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory