import { AccountAccess } from "@/components/preview/cards/account-access";
import { CardOverview } from "@/components/preview/cards/card-overview";
import { ClaimableBalance } from "@/components/preview/cards/claimable-balance";
import { ContributionHistory } from "@/components/preview/cards/contribution-history";
import { CoverArt } from "@/components/preview/cards/cover-art";
import { DividendIncome } from "@/components/preview/cards/dividend-income";
import { EmptyConnectBank } from "@/components/preview/cards/empty-connect-bank";
import { EmptyDistributeTrack } from "@/components/preview/cards/empty-distribute-track";
import { EmptyExploreCatalog } from "@/components/preview/cards/empty-explore-catalog";
import { Faq } from "@/components/preview/cards/faq";
import { FrontDoor } from "@/components/preview/cards/front-door";
import { IndexInvesting } from "@/components/preview/cards/index-investing";
import { KitchenIsland } from "@/components/preview/cards/kitchen-island";
import { LoadingCard } from "@/components/preview/cards/loading-card";
import { NewMilestone } from "@/components/preview/cards/new-milestone";
import { NotificationSettings } from "@/components/preview/cards/notification-settings";
import { Payments } from "@/components/preview/cards/payments";
import { PayoutThreshold } from "@/components/preview/cards/payout-threshold";
import { PowerUsage } from "@/components/preview/cards/power-usage";
import { Preferences } from "@/components/preview/cards/preferences";
import { QrConnect } from "@/components/preview/cards/qr-connect";
import { ReceivingMethod } from "@/components/preview/cards/receiving-method";
import { RecentTransactions } from "@/components/preview/cards/recent-transactions";
import { ReleaseCatalog } from "@/components/preview/cards/release-catalog";
import { RollerShades } from "@/components/preview/cards/roller-shades";
import { SavingsProgress } from "@/components/preview/cards/savings-progress";
import { SavingsTargets } from "@/components/preview/cards/savings-targets";
import { SidebarNav } from "@/components/preview/cards/sidebar-nav";
import { SocialLinks } from "@/components/preview/cards/social-links";
import { StockPerformance } from "@/components/preview/cards/stock-performance";
import { SyncingState } from "@/components/preview/cards/syncing-state";
import { TransferFunds } from "@/components/preview/cards/transfer-funds";
import { UpcomingPayments } from "@/components/preview/cards/upcoming-payments";

export default function Preview02Example() {
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-muted contain-[paint] [--gap:--spacing(4)] 3xl:[--gap:--spacing(12)] md:[--gap:--spacing(10)] dark:bg-background style-lyra:md:[--gap:--spacing(6)] style-mira:md:[--gap:--spacing(6)]">
      <div className="flex w-full min-w-max justify-center">
        <div
          className="grid w-[2400px] grid-cols-7 items-start gap-(--gap) bg-muted p-(--gap) md:w-[3000px] dark:bg-background style-lyra:md:w-[2600px] style-mira:md:w-[2600px] *:[div]:gap-(--gap)"
          data-slot="capture-target"
        >
          <div className="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <ContributionHistory />
            <EmptyDistributeTrack />
            <QrConnect />
            <DividendIncome />
            <IndexInvesting />
            <SyncingState />
          </div>
          <div className="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <PayoutThreshold />
            <ClaimableBalance />
            <Preferences />
            <SavingsProgress />
            <KitchenIsland />
          </div>
          <div className="col-span-2 flex flex-col p-1 [contain-intrinsic-size:760px_1200px] [content-visibility:auto]">
            <SavingsTargets />
            <RecentTransactions />
            <div className="grid grid-cols-2 items-start gap-(--gap)">
              <div className="flex flex-col gap-(--gap)">
                <SidebarNav />
                <Faq />
              </div>
              <div className="flex flex-col gap-(--gap)">
                <Payments />
                <FrontDoor />
              </div>
            </div>
            <ReleaseCatalog />
          </div>
          <div className="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <AccountAccess />
            <CardOverview />
            <TransferFunds />
            <CoverArt />
            <LoadingCard />
          </div>
          <div className="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <ReceivingMethod />
            <PowerUsage />
            <EmptyConnectBank />
            <UpcomingPayments />
            <RollerShades />
          </div>
          <div className="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <StockPerformance />
            <EmptyExploreCatalog />
            <NewMilestone />
            <SocialLinks />
            <NotificationSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
