import VerifyEmailView from "@/components/Auth/VerifyEmailView";
import { useVerifyEmail } from "@/hooks/Auth/useVerifyEmail";
import { useSearchParams } from "react-router-dom";


function parseUserId(v: string | null) : number | undefined {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined
}

export default function VerifyEmail() {
    const [sp] = useSearchParams();

    const userId = parseUserId(sp.get("userId"));
    const token = sp.get("token") ?? undefined;

    const state = useVerifyEmail(userId, token);

    return <VerifyEmailView state={state} />;
}

