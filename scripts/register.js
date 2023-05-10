const sp = supabase.createClient('https://lcryqlqpdqdowkvbpbfw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnlxbHFwZHFkb3drdmJwYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjg0OTcsImV4cCI6MTk5NjMwNDQ5N30.mSExOgnGEFt207qykfP6hzIiQ7k9z642ZDR-ucVy4eg')


const email = document.querySelector('.email')
const password = document.querySelector('.password')

async function signUp() {
    const {
        data,
        error
    } = await sp.auth.signUp({
        email: email.value,
        password: password.value
    })
    if(!data) {
        alert('Произошла ошибка! Попробуйте ещё раз.')
    }
}
