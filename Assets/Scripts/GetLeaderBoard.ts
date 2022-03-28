import { Debug } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetAllLeaderboardsResponse, LeaderboardAPI } from 'ZEPETO.Script.Leaderboard'

export default class GetAllLeaderboardsExample extends ZepetoScriptBehaviour {

Start() {
    LeaderboardAPI.GetAllLeaderboards(this.OnResult, this.OnError);
}

OnResult(result: GetAllLeaderboardsResponse) {
    Debug.Log(`[GetAllLeaderboards] result.isSuccess: ${result.isSuccess}`);

    if (result.leaderboards) {
        for (let i = 0; i < result.leaderboards.length; ++i) {
            var leaderboard = result.leaderboards[i];
            Debug.Log(`i: ${i}, id: ${leaderboard.id}, name: ${leaderboard.name}`);
        }
    }
}

OnError(error: string) {
    Debug.LogError(`[GetAllLeaderboards] ${error}`);
}
}