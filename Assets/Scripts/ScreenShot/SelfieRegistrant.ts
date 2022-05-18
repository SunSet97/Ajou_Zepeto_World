import { Camera, GameObject, Transform, Vector3 } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { RoomData } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ClientStarter from '../ClientStarter';
import OnlineWithPlayer from './OnlineWithPlayer';


class CameraAndUI{
    camera : Transform
    ui : Transform
}

export default class SelfieRegistrant extends ZepetoScriptBehaviour {

    private static _instance: SelfieRegistrant;
    
    public static get instance(): SelfieRegistrant {
        return this._instance;
    }

    public uiPrefab : GameObject
    public cameraOffset : Vector3

    @Space(10)
    public cameraPrefab : GameObject

    public selfieStickPrefab : GameObject

    private localCamera : Camera
    private tempUsers : Map<ZepetoPlayer, OnlineWithPlayer>    //player, UI
    private users : Map<ZepetoPlayer, CameraAndUI>    //player, UI
    private withUsers : Map<ZepetoPlayer, ZepetoPlayer>    //withplayer, player
    
    Awake(){
        SelfieRegistrant._instance = this
    }

    Start(){
        this.tempUsers = new Map<ZepetoPlayer, OnlineWithPlayer>()
        this.users = new Map<ZepetoPlayer, CameraAndUI>()
        this.withUsers = new Map<ZepetoPlayer, ZepetoPlayer>()

        ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId : string) =>{
            if(!ZepetoPlayers.instance.HasPlayer(sessionId)) return
            const player = ZepetoPlayers.instance.GetPlayer(sessionId)
            let online = player.character.ZepetoAnimator.gameObject.AddComponent<OnlineWithPlayer>()
            // const online1
            // let online23 = player.character.ZepetoAnimator.gameObject.TryGetComponent<OnlineWithPlayer>(online1)
            // ClientStarter.instance.Debug(player.character.gameObject)
            // ClientStarter.instance.Debug("핳")
            // ClientStarter.instance.Debug(online.gameObject)
            // ClientStarter.instance.Debug(typeof(online))
            // ClientStarter.instance.Debug(online.name)
            this.tempUsers.set(player, online)
        })
        ZepetoPlayers.instance.OnRemovedPlayer.AddListener((sessionId : string) =>{
            if(!ZepetoPlayers.instance.HasPlayer(sessionId)) return
            const player = ZepetoPlayers.instance.GetPlayer(sessionId)
            if(player != null){
                this.tempUsers.delete(player)
            }
        })
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.localCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })
    }

    // 찍는 유저 등록
    public AddSelfieUser(takingSessionId : string){
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        ClientStarter.instance.Debug(`Try Add SelfiePlayer`)
        ClientStarter.instance.Debug(`보는 사람 - ${ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject}`)
        if(!ZepetoPlayers.instance.HasPlayer(takingSessionId)) return
        const player = ZepetoPlayers.instance.GetPlayer(takingSessionId)
        ClientStarter.instance.Debug(`대상 - ${player.character.gameObject}`)
        // let onlinePlayer = player.character.ZepetoAnimator.gameObject.GetComponent<OnlineWithPlayer>()
        let onlinePlayer = this.tempUsers.get(player)
        // ClientStarter.instance.Debug(`1`)
        // ClientStarter.instance.Debug(onlinePlayer)
        onlinePlayer.Initialize(this.cameraPrefab, this.uiPrefab)
        // ClientStarter.instance.Debug(`2`)
        const cameraAndUI = new CameraAndUI()
        cameraAndUI.camera = onlinePlayer.cameraTarget
        cameraAndUI.ui = onlinePlayer.buttonUI
        this.users.set(player, cameraAndUI)
        
        // ClientStarter.instance.Debug(`3`)
        onlinePlayer.buttonUI.GetComponent<Button>().onClick.AddListener(() =>{
            this.SetTakeWithUI(true, takingSessionId, ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id)
            this.TakeWithSendData(true, takingSessionId, ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id)
        })

        // ClientStarter.instance.Debug(`4`)
        onlinePlayer.SetPlayer(player, this.selfieStickPrefab)
        ClientStarter.instance.Debug(`Add SelfiePlayer 완료`)
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
    }

    // 찍는 유저 삭제
    public DeleteSelfieUser(takingSessionId : string){
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        ClientStarter.instance.Debug('Delete Try')
        if(!ZepetoPlayers.instance.HasPlayer(takingSessionId)) return
        
        const player = ZepetoPlayers.instance.GetPlayer(takingSessionId)
        
        if(this.users.has(player))
        {
            let onlinePlayer = this.tempUsers.get(player)
            // let onlinePlayer = player.character.ZepetoAnimator.gameObject.GetComponent<OnlineWithPlayer>()
            //셀카봉 삭제
            onlinePlayer.RemovePlayer(player)
            this.users.delete(player)
        }
        ClientStarter.instance.Debug('Delete Complete')
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
    }

    //sessionId - 셀카 찍는 유저, client - 셀카 누른(당한) 유저
    TakeWithSendData(isWith : boolean, takingSessionId : string, takedSessionId : string){
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        ClientStarter.instance.Debug(`Try Take With Send Data : ${isWith}`)
        // const hasTakingPlayer = ZepetoPlayers.instance.HasPlayer(takingSessionId)
        if(isWith){
            const data = new RoomData()
            data.Add('sessionId', takingSessionId)
            data.Add('withSessionId', takedSessionId)
            const room = ClientStarter.instance.GetRoom()
            room.Send('onTakeWith', data.GetObject())            
        }else{
            const data = new RoomData()
            data.Add('sessionId', takingSessionId)
            const room = ClientStarter.instance.GetRoom()
            room.Send('onTakeWithout', data.GetObject())
        }
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        ClientStarter.instance.Debug(`Complete Take With Send Data : ${isWith}`)
    }

    //UI 버튼 연결 true - 키기, false - 끄기
    SetTakeWithUI(isWith : boolean, takingSessionId : string, takedSessionId : string){
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        ClientStarter.instance.Debug(`Try Take Setting UI 키기: ${isWith}`)
        if(!ZepetoPlayers.instance.HasPlayer(takingSessionId)) return
        const takingPlayer = ZepetoPlayers.instance.GetPlayer(takingSessionId)
        const btn = this.users.get(takingPlayer).ui.GetComponent<Button>()
        btn.onClick.RemoveAllListeners()
        if(isWith){
            btn.onClick.RemoveAllListeners()
            btn.onClick.AddListener(() =>{
                this.SetTakeWithUI(false, takingSessionId, takedSessionId)
                this.TakeWithSendData(false, takingSessionId, takedSessionId)
            })
            // IKController 생성 후 그립 위치로 손, 카메라 바라보기
            // 손에다가 생성
        }else{
            btn.onClick.AddListener(() =>{
                this.SetTakeWithUI(true, takingSessionId, takedSessionId)
                this.TakeWithSendData(true, takingSessionId, takedSessionId)
            })
        }
        ClientStarter.instance.Debug(`Complete Take Setting UI 키기: ${isWith}`)
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
    }

    Update(){
        // ClientStarter.instance.Debug(`${ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject}가 본다.`)
        this.users.forEach((cameraAndUI : CameraAndUI, player : ZepetoPlayer) =>{
            let onlineWithPlayer = this.tempUsers.get(player)
            const screenPos = this.localCamera.WorldToScreenPoint(player.character.transform.position + this.cameraOffset)
            onlineWithPlayer.OnUpdateOnline(player, screenPos)
        })
    }

    public LookAt(sessionId : string, withSessionId : string){
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        ClientStarter.instance.Debug(`저이 봐봐라`)
        if(!ZepetoPlayers.instance.HasPlayer(sessionId) || !ZepetoPlayers.instance.HasPlayer(withSessionId)) return
        const takePlayer = ZepetoPlayers.instance.GetPlayer(sessionId)
        const withPlayer = ZepetoPlayers.instance.GetPlayer(withSessionId)
        this.withUsers.set(withPlayer, takePlayer)
        // 이제부터 selfieCamera 위치 보내
        this.tempUsers.get(withPlayer).Watch(this.users.get(takePlayer).camera)
        // if(takePlayer.isLocalPlayer){
        //     this.tempUsers.get(withPlayer).Watch(ZepetoPlayers.instance.ZepetoCamera.camera.transform)
        // }else{
        //     this.tempUsers.get(withPlayer).Watch(this.users.get(takePlayer).camera)
        // }
        ClientStarter.instance.Debug(`Complete LookAT`)
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
    }

    public StopLookAt(withSessionId : string){
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
        ClientStarter.instance.Debug(`저이 스탑 보지마`)
        if(!ZepetoPlayers.instance.HasPlayer(withSessionId)) return
        const withPlayer = ZepetoPlayers.instance.GetPlayer(withSessionId)
        if(this.withUsers.has(withPlayer)){
            this.withUsers.delete(withPlayer)
            this.tempUsers.get(withPlayer).StopWatch()
            // withPlayer.character.ZepetoAnimator.GetComponent<OnlineWithPlayer>().StopWatch()
            ClientStarter.instance.Debug(`같이 찍는 애 - ${withSessionId} - 스탑 성공`)
        }
        ClientStarter.instance.Debug(`Complete Stop LookAt`)
        ClientStarter.instance.Debug(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`)
    }

    WathcingAny(sessionId : string) : boolean {
        var isWith = false
        this.withUsers.forEach((takePlayer : ZepetoPlayer, withPlayer : ZepetoPlayer) =>{
            if(takePlayer.id === sessionId)
                isWith = true
        })
        return isWith
    }

    HasPlayer(sessionId : string) : boolean{
        if(!ZepetoPlayers.instance.HasPlayer(sessionId)) return false
        const player = ZepetoPlayers.instance.GetPlayer(sessionId)
        var isWith = false
        
        this.withUsers.forEach((takePlayer : ZepetoPlayer, withPlayer : ZepetoPlayer) =>{
            if(takePlayer.id === sessionId || withPlayer.id === sessionId)
                isWith = true
        })
        return this.users.has(player) || isWith
    }
}