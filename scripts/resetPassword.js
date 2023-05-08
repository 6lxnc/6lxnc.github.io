const sp = supabase.createClient('https://lcryqlqpdqdowkvbpbfw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnlxbHFwZHFkb3drdmJwYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjg0OTcsImV4cCI6MTk5NjMwNDQ5N30.mSExOgnGEFt207qykfP6hzIiQ7k9z642ZDR-ucVy4eg')

const newPass = document.querySelector('.newPassword')
const resetEmail = document.querySelector('.reset')
const success = document.querySelector('.succes')
const form = document.querySelector('.form')

async function resetPassword() {
    const { data, error } = await sp.auth.resetPasswordForEmail(resetEmail.value, {
        redirectTo: 'https://6lxnc.github.io/newPass.html',
    })
    if(data) {
        success.classList.add('true')
        form.classList.add('hide')
        setTimeout(() => {
            window.location.replace('/')
        }, 10000);
    }
}

async function updateUser() {
    const { data, error } = await supabase.auth.updateUser({
        password: newPass.value
      })
}