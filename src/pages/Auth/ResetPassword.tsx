import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import { useSearchParams } from "react-router-dom"


export default function ResetPassword() {
    const [sp] = useSearchParams();
    const email = sp.get("email") ?? undefined
    const token = sp.get("token") ?? undefined

  return (
    <div>
        <ResetPasswordForm email={email} token={token}/>
    </div>
  )
}
