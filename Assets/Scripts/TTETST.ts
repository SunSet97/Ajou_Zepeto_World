import { AnimationClip, Application, GameObject, Rect, Sprite, Texture2D, Vector2, WaitUntil, WaitWhile } from 'UnityEngine'
import { Button, Image } from 'UnityEngine.UI'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Content, OfficialContentType, QuickMessage, WorldMultiplayChatContent, WorldMultiplayContent, ZepetoWorldContent, ZepetoWorldMultiplay } from 'ZEPETO.World'
import AnimationLinker from './AnimationLinker'
import ClientStarter from './ClientStarter'
import SS_UIController from './SS_UIController'
import UIGesture from './UIGesture'

export default class TTETST extends ZepetoScriptBehaviour {

    // public messageButton : Button
    // public quickButton : Button
    public uiGesture : GameObject
    public _uiGesture : UIGesture

    private gestureItemIndex : number = 0
    private poseItemIndex : number = 0
    private ContentsLen : number = -1

    public uiController : GameObject
    private _uiController : SS_UIController


    public gestures  : number[]
    public poses  : number[]

    public isAll : boolean

    public GestureIndexTest(index : number){
        var isInclude = this.gestures.includes(index)
        if(isInclude){
            this.gestures = this.gestures.filter((element) =>{
                return element != index
            })
            console.log("삭제삭제삭제")
            console.log("삭제삭제삭제")
            console.log("삭제삭제삭제")
            console.log("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
        }else{
            this.gestures.push(index)
            console.log("추가추가추가")
            console.log("추가추가추가")
            console.log("추가추가추가")
            console.log("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
        }
    }

    public PoseIndexTest(index : number){
        var isInclude = this.poses.includes(index)
        if(isInclude){
            this.poses = this.poses.filter((element) =>{
                return element != index
            })
            console.log("삭제삭제삭제")
            console.log("삭제삭제삭제")
            console.log("삭제삭제삭제")
            console.log("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
            ClientStarter.instance.Debug("삭제삭제삭제")
        }else{
            this.poses.push(index)
            console.log("추가추가추가")
            console.log("추가추가추가")
            console.log("추가추가추가")
            console.log("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
            ClientStarter.instance.Debug("추가추가추가")
        }
    }
    Start() {
        this._uiController = this.uiController.GetComponent<SS_UIController>()
        this._uiGesture = this.uiGesture.GetComponent<UIGesture>()
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            ZepetoWorldContent.RequestOfficialContentList(OfficialContentType.Gesture, (contents : Content[]) =>{
                console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
                console.log(contents.length)
                var character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
                var contentLen : number = 0
                // if(Application.isEditor) return
                for(var index = 0; index < contents.length; index++){
                    
                    if(!this.isAll){
                        var isInclude = this.gestures.includes(index)
                        if(!isInclude)
                            continue
                    }
                    contentLen++
                    const idx = index
                    const cnt = contents[idx]
                    cnt.DownloadAnimation(() =>{
                        console.log("애니메이션")
                        console.log(idx)
                        console.log(cnt)
                        console.log(cnt.AnimationClip)
                        const aniClip = cnt.AnimationClip
                        AnimationLinker.instance.AddGestureAndPoseClip(cnt.AnimationClip)
                        this._uiGesture.AddGestureClip(aniClip, idx)
    
                        if(!Application.isEditor){
                            // isDownloadAnimation 기다리다가 실행
                            cnt.DownloadThumbnail(character, () =>{
                                ClientStarter.instance.Debug("썸네일")
                                ClientStarter.instance.Debug(idx)
                                console.log(this.gestureItemIndex)
                                var texture = cnt.Thumbnail
                                // ClientStarter.instance.Debug(texture)
                                ClientStarter.instance.Debug(texture.width)
                                ClientStarter.instance.Debug(texture.height)
                                const sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5, 0.5))
                                this._uiGesture.SetGestureThumbnail(sprite, this.gestureItemIndex)
                                this.gestureItemIndex++
                                console.log('인덱스 ++++++++')
                                console.log(this.gestureItemIndex)
                            })
                        }else{
                            this._uiGesture.SetGestureThumbnail(null, this.gestureItemIndex)
                            this.gestureItemIndex++
                            console.log('인덱스 ++++++++')
                            console.log(this.gestureItemIndex)
                        }
                    })
                }
                if(this.ContentsLen < 0) this.ContentsLen = 0
                this.ContentsLen += contentLen
                console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
            })


            ZepetoWorldContent.RequestOfficialContentList(OfficialContentType.Pose, (contents : Content[]) =>{
                console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
                console.log(contents.length)
                var character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
                // if(Application.isEditor) return
                var contentLen : number = 0
                for(var index = 0; index < contents.length; index++){
                    const idx = index
                    const cnt = contents[idx];
                    contentLen++
                    cnt.DownloadAnimation(() =>{
                        console.log("애니메이션 포즈")
                        console.log(idx)
                        console.log(cnt)
                        console.log(cnt.AnimationClip)
                        const aniClip = cnt.AnimationClip
                        AnimationLinker.instance.AddGestureAndPoseClip(cnt.AnimationClip)
                        this._uiGesture.AddPoseClip(aniClip, idx)
    
                        if(!Application.isEditor){
                            // isDownloadAnimation 기다리다가 실행
                            cnt.DownloadThumbnail(character, () =>{
                                ClientStarter.instance.Debug("썸네일")
                                ClientStarter.instance.Debug(idx)
                                var texture = cnt.Thumbnail
                                // ClientStarter.instance.Debug(texture)
                                ClientStarter.instance.Debug(texture.width)
                                ClientStarter.instance.Debug(texture.height)
                                const sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5, 0.5))
                                this._uiGesture.SetPoseThumbnail(sprite, this.poseItemIndex)
                                this.poseItemIndex++
                                console.log('인덱스 ++++++++')
                                console.log(this.poseItemIndex)
                            })
                        }else{
                            this._uiGesture.SetPoseThumbnail(null, this.poseItemIndex)
                            this.poseItemIndex++
                            console.log('인덱스 ++++++++')
                            console.log(this.poseItemIndex)
                        }
                    })
                    
                }
                if(this.ContentsLen < 0) this.ContentsLen = 0
                this.ContentsLen += contentLen
                console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
            })
            this.StartCoroutine(this.OnCompleteGesture())
        })
        
        // ZepetoWorldContent.GetQuickMessageList((quickMessages : QuickMessage[]) =>{
        //     console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
        //     console.log(quickMessages.length)
        //     for(var idx = 0; idx < quickMessages.length; idx++){
        //         console.log(quickMessages[idx])
        //         console.log(quickMessages[idx].id)
        //         console.log(quickMessages[idx].message)
        //     }
        //     console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
        // }, (errorMessage) =>{ console.log(`에러 메시지 : ${errorMessage}`)})


        // ZepetoWorldContent.ResetQuickMessageList((quickMessages : QuickMessage[]) =>{
        //     console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
        //     console.log(quickMessages.length)
        //     for(var idx = 0; idx < quickMessages.length; idx++){
        //         console.log(quickMessages[idx])
        //         console.log(quickMessages[idx].id)
        //         console.log(quickMessages[idx].message)
        //     }
        //     console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
        // }, (errorMessage) =>{ console.log(`에러 메시지 : ${errorMessage}`)})

        // this.messageButton.onClick.AddListener(() =>{
        //     ClientStarter.instance.Debug("채팅")
        //     WorldMultiplayChatContent.instance.Send("테스트 메시지")
        // })
    }
    *OnCompleteGesture(){
        console.log(this.ContentsLen)
        yield new WaitUntil(() =>{
            return this.ContentsLen == this.gestureItemIndex + this.poseItemIndex
        })
        console.log(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        console.log(this.gestureItemIndex + this.poseItemIndex)
        this._uiController.InitUIPos()
        console.log(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
    }
}