import { WALLET, WALLET_LANG } from "@libs/typeorm/common/enum";
import { RewardHistory } from "@libs/typeorm/reward-history";
import { Expose } from "class-transformer";

export class RewardHistoryResponse extends RewardHistory {
    @Expose({ name: 'wallet_name' })
    walletName: WALLET_LANG

    static fromRewardHistory(rewardHistory: RewardHistory): RewardHistoryResponse {
        const instance = new RewardHistoryResponse()
        Object.assign(instance, rewardHistory)

        instance.walletName = WALLET_LANG[WALLET[instance.wallet]]
        return instance
    }

    static fromRewardHistories(rewardHistories: RewardHistory[]): RewardHistoryResponse[] {
        return rewardHistories.map((rewardHistory) => {
            return RewardHistoryResponse.fromRewardHistory(rewardHistory)
        })
    }
}