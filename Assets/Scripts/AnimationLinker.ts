import { AnimationClip, Animator, AnimatorOverrideController, Avatar, AvatarIKGoal, AvatarMask, GameObject, RuntimeAnimatorController, WaitForSeconds, WaitUntil } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import ClientStarter from './ClientStarter';

export default class AnimationLinker extends ZepetoScriptBehaviour {


    public originalAnimators : Map<string, RuntimeAnimatorController>
    public animationNames : Map<string, string> // sessionId, current animationName for each player
    public gestures : AnimationClip[] // GestureName, AnimationClip
    public isGesture : Map<string, bool> // sessionId, isGesturing
    private static _instance: AnimationLinker;
    
    public static get instance(): AnimationLinker {
        return this._instance;
    }

    @Header("--------------------------------")
    public originalName : string
    @Header("디버그용입니다 넣지 마세용")
    //왜 이거 하나밖에 없어 오류 걸리지 않나?
    // public animationName : string   //현재 animation 이름 - "", "물건 든 상태", "어떤 상태"
    @Header("--------------------------------")

    @Header("애니메이션 형식 기존이름_이름으로 넣으세요. ex) idle_cup")
    public animations : AnimationClip[]

    private readonly AniOriginal : string[] = ["idle", "walk", "run", "jump_idle", "jump_move"]

    Awake(){
        GameObject.DontDestroyOnLoad(this.gameObject)
        this.originalAnimators = new Map<string, RuntimeAnimatorController>()
        this.animationNames = new Map<string, string>()
        this.isGesture = new Map<string, bool>()
        AnimationLinker._instance = this
    }

    //Local에서 실행하는 함수
    SendAnimationToServer(name : string){
        const sessionId = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id
        const animationName = this.GetPlayerAnimation(sessionId)
        if(animationName !== name){
            //player.state.animation 바꿔줘야되는데 바꿔주면 SetAnimation이 작동한다.
            // if(name === null || name.length === 0)
                // this.ResetAniamtor(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator, sessionId)
            // else
            this.SetAnimation(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator, sessionId, name)
            console.log("로컬 세팅")
            ClientStarter.instance.SendAnimation(name)
        }
    }
    
    //Local에서 실행하는 함수
    PlayGesture(name : string){
        //실행한 상태에서 다시 실행하는 경우에는 ???
        const player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer
        if(!this.GetIsGesturing(player.id)){
            this.GestureHandler(player, name)
            ClientStarter.instance.SendGesture(name)
        }
    }
    

    GestureHandler(player : ZepetoPlayer, gestureName : string){
        this.SetisGesture(player.id, true)

        const clip = this.GetPlayerGesture(gestureName);
        // this.StopCoroutine(this.GestureStop(player.character, clip.length))
        // 쓰읍 실행 중인 플레이어만 멈추려면 StopAllCorutine 쓰면 안되는데
        // 다른데랑 겹친다 Client에서 isGesturing() 체크하는 부분 다시 생각하도록
        console.log(clip)
        this.ResetAniamtor(player.character.ZepetoAnimator, player.id)
        player.character.SetGesture(clip)
        this.StartCoroutine(this.GestureStop(player, clip.length))
    }
    *GestureStop(player : ZepetoPlayer, clipTime : float){
        yield new WaitForSeconds(clipTime)
        this.SetisGesture(player.id, false)
        this.OverrideAnimator(player.character.ZepetoAnimator, this.GetPlayerAnimation(player.id))
        player.character.CancelGesture()
    }


    // move 애니메이터 및 클립을 변경시키는 함수
    SetAnimation(charAnimator : Animator, sessionId : string, name : string){
        // //animationName - ex) "", "coffee"
        this.SetPlayerAnimation(sessionId, name)
        
        if(name === null || name.length === 0){
            this.ResetAniamtor(charAnimator, sessionId)
        }else{
            this.OverrideAnimator(charAnimator, name)
        }
    }

    OverrideAnimator(charAnimator : Animator, name : string){
        var overrideController : AnimatorOverrideController = new AnimatorOverrideController(charAnimator.runtimeAnimatorController);
        charAnimator.runtimeAnimatorController = overrideController
        
        for(var index = 0; index < this.AniOriginal.length; index++){
            // console.log("아이템 : " + this.AniOriginal[index])
            overrideController[this.AniOriginal[index]] = this.FindAnimationClip(this.AniOriginal[index] + "_" + name);
        }
    }

    ResetAniamtor(charAnimator : Animator, sessionId : string){
        charAnimator.runtimeAnimatorController = this.originalAnimators.get(sessionId)
    }


    OnAddPlayer(sessionId : string, animator : Animator, animationName : string){        
        this.originalAnimators.set(sessionId, animator.runtimeAnimatorController)
        this.SetPlayerAnimation(sessionId, animationName)
        this.SetisGesture(sessionId, false)
        if(animationName !== ''){
            AnimationLinker.instance.OverrideAnimator(animator, animationName)
            // AnimationLinker.instance.OverrideAnimator(zepetoPlayer.character.ZepetoAnimator, player.animation)
        }
    }


    // item name - asda_idle, asda_jump_move
    FindAnimationClip(name : string) : AnimationClip{
        var clip : AnimationClip = this.animations.find((item) => {return item.name === name})
        return clip
    }

    GetPlayerAnimation(sessionId : string) : string{
        var animationName : string = this.animationNames.get(sessionId)
        return animationName
    }

    SetPlayerAnimation(sessionId : string, name : string){
        if(this.animationNames.has(sessionId)){
            this.animationNames.delete(sessionId)
        }
        this.animationNames.set(sessionId, name)
    }


    GetPlayerGesture(gestureName : string) : AnimationClip{
        var clip : AnimationClip = this.gestures.find((item) => {return item.name === gestureName})
        return clip
    }

    GetIsGesturing(sessionId : string) : bool{
        var isGesture : bool = this.isGesture.get(sessionId)
        return isGesture
    }
    SetisGesture(sessionId : string, isGesture : bool){
        if(this.isGesture.has(sessionId)){
            this.isGesture.delete(sessionId)
        }
        this.isGesture.set(sessionId, isGesture)
    }
}