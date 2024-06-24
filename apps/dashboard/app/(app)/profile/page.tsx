import getUserSession from '@/lib/get-user-session';
import { redirect } from 'next/navigation';

// TODO : private pages should be fixed with middleware
// TODO : in middleware if there is no language native go to onboarding

export default async function ProfilePage() {
    const {
        data: { session },
    } = await getUserSession();

    if (!session) {
        return redirect('/login');
    }

    const user = session.user;

    return (
        <>
            <section className='bg-ct-blue-600  min-h-screen pt-20'>
                <div className='max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center'>
                    <div>
                        <p className='mb-3 text-5xl text-center font-semibold'>
                            Profile Page
                        </p>
                        <div className='mt-8'>
                            <p className='mb-3'>Id: {user.id}</p>
                            <p className='mb-3'>Role: {user.role}</p>
                            <p className='mb-3'>Email: {user.email}</p>
                            <p className='mb-3'>Provider: {user.app_metadata['provider']}</p>
                            <p className='mb-3'>Created At: {user.created_at}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
