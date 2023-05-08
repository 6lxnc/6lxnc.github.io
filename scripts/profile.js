const sp = supabase.createClient('https://lcryqlqpdqdowkvbpbfw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnlxbHFwZHFkb3drdmJwYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjg0OTcsImV4cCI6MTk5NjMwNDQ5N30.mSExOgnGEFt207qykfP6hzIiQ7k9z642ZDR-ucVy4eg')

const wrapper = document.querySelector('.wrapper')

async function getUser() {
    const { data: { user } } = await sp.auth.getUser()
    if(user == null) {
        window.location.replace('/login')
    }
}

async function signOut() {
  const { error } = await sp.auth.signOut()
  window.location.replace('/')
}

addEventListener('DOMContentLoaded', getUser())