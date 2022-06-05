import { GameObject, Rect, Sprite, Texture, Texture2D, Time, Vector2 } from 'UnityEngine'
import { Image, Text } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetRangeRankResponse, LeaderboardAPI, Rank, ResetRule, SetScoreResponse } from 'ZEPETO.Script.Leaderboard'
import { ZepetoWorldHelper } from 'ZEPETO.World'

export default class LeaderBoard extends ZepetoScriptBehaviour {

    public profileImage: Image[]
    public medalImage: Image[]
    public medalText: Text[]
    public playerName: Text[]
    public score: Text[]
    public leaderBoardPanel: GameObject

    @Header("1, 2, 3위, 그 외 순서대로 넣으세요.")
    public medalSprites: Sprite[]
    public leaderBoardItemParent: GameObject
    public timerText: Text
    public resetRule: ResetRule

    @Header("디버그용입니다~")
    public timer: number
    @SerializeField()
    public isStart: bool

    public readonly leaderboardId: string
    Start() {
        var itemCount = this.leaderBoardItemParent.transform.childCount
        this.leaderBoardPanel.SetActive(false)
        this.profileImage = new Array<Image>(itemCount)
        this.medalImage = new Array<Image>(itemCount)
        this.medalText = new Array<Text>(itemCount)
        this.playerName = new Array<Text>(itemCount)
        this.score = new Array<Text>(itemCount)
        for (var i = 0; i < itemCount; i++) {
            this.medalImage[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(0).GetComponent<Image>()
            this.medalText[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(0).GetChild(0).GetComponent<Text>()
            this.profileImage[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(1).GetChild(0).GetComponent<Image>()
            this.playerName[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(1).GetChild(1).GetComponent<Text>()
            this.score[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(1).GetChild(2).GetComponent<Text>()
        }
    }
    GameStart() {
        if (!this.isStart) {
            this.isStart = true
            this.timer = 0
            this.timerText.gameObject.SetActive(true)
            this.StartCoroutine(this.OnUpdatePlay())
        }
    }

    public GameStop(){
        this.timerText.gameObject.SetActive(false)
        this.timer = 0
        this.isStart = false
    }

    public GameEnd(isSuccess : boolean) {
        if (this.isStart) {
            if(isSuccess)
                LeaderboardAPI.SetScore(this.leaderboardId, this.timer * 10, this.OnSetScoreResult, (error) => { console.log("에러 : " + error) })
            this.GameStop()
            this.ShowRank()
        }
    }

    *OnUpdatePlay() {
        while (this.isStart) {
            this.timer += Time.deltaTime
            this.timerText.text = `${this.timer.toString()}`
            yield null
        }
    }

    public ShowRank() {
        LeaderboardAPI.GetRangeRank(this.leaderboardId, 1, 10000, this.resetRule, false, (response: GetRangeRankResponse) => {
            console.log("리더보드 불러오기 결과 : " + response.isSuccess)
            console.log("총 랭킹 카운트" + response.rankInfo.totalRankCount)

            if(response.rankInfo.rankList == null) return
            for (var index = 0; index < response.rankInfo.rankList.length; index++) {
                var rank = response.rankInfo.rankList[index]
                console.log("랭크 : " + " " + rank.name + " " + rank.score + " " + rank.rank + '\n' + rank.member)
            }

            // console.log("--------------------------")
            this.leaderBoardPanel.SetActive(true)
            var childCount = this.leaderBoardItemParent.transform.childCount

            var index = 0
            if (response.rankInfo.myRank.rank != null) {
                var myRank: Rank = response.rankInfo.myRank
                console.log("내 랭킹" + myRank.name + " " + myRank.score / 10 + " " + myRank.rank + '\n' + myRank.member)
                if (myRank.rank > 3) {
                    this.medalText[index].text = myRank.rank.toString()
                    this.medalImage[index].sprite = this.medalSprites[3]
                } else {
                    this.medalImage[index].sprite = this.medalSprites[index]
                    this.medalText[index].text = ''
                }
                this.medalImage[index].enabled = true
                this.profileImage[index].enabled = true
                this.SetProfileImage(this.profileImage[index], myRank.member)
                this.playerName[index].text = myRank.name
                this.score[index].text = (myRank.score / 10).toString()
                index++
            }
            for (var rankIndex = 0; index < childCount; index++, rankIndex++) {
                //보여주기
                if (index < response.rankInfo.rankList.length) {
                    var rank: Rank = response.rankInfo.rankList[rankIndex]
                    if(rank.rank == response.rankInfo.myRank.rank){
                        rank = response.rankInfo.rankList[++rankIndex]
                        if(index >= response.rankInfo.rankList.length)
                            continue
                    }
                    if (rank.rank > 3) {
                        this.medalText[index].text = rank.rank.toString()
                        this.medalImage[index].sprite = this.medalSprites[3]
                    } else {
                        this.medalImage[index].sprite = this.medalSprites[index]
                        this.medalText[index].text = ''
                    }
                    this.medalImage[index].enabled = true
                    this.profileImage[index].enabled = true
                    this.SetProfileImage(this.profileImage[index], rank.member)
                    this.playerName[index].text = rank.name
                    this.score[index].text = (rank.score / 10).toString()
                } else {
                    this.medalImage[index].enabled = false
                    this.medalText[index].text = ''
                    this.profileImage[index].enabled = false
                    this.playerName[index].text = ''
                    this.score[index].text = ''
                }
            }

        }, (error) => { console.log("에러 : ", error) })
    }


    OnSetScoreResult(setScoreResponse: SetScoreResponse) {
        console.log("점수 설정" + setScoreResponse.isSuccess)
    }

    SetProfileImage(image: Image, userId: string) {
        ZepetoWorldHelper.GetProfileTexture(userId, (texture: Texture) => {

            image.sprite = this.GetSprite(texture)
        }, (error: string) => {
            console.log("에러 : " + error)
        })
    }

    GetSprite(texture: Texture) {
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }
}