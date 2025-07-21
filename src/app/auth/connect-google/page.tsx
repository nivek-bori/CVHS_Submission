import ConnectGoogle from "@/components/auth/connect-google";
import EnforceMFA from "@/components/auth/mfa/enforce-mfa";

export default function ConnectGooglePage() {
  return (
    <EnforceMFA className={'w-full h-full'}>
      <ConnectGoogle></ConnectGoogle>
    </EnforceMFA>
  )
}