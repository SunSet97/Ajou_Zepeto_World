import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {ZepetoWorldMultiplay} from 'ZEPETO.World'
import {Room, RoomData} from 'ZEPETO.Multiplay'
import {Player, State, Vector3} from 'ZEPETO.Multiplay.Schema'
import {CharacterState, SpawnInfo, ZepetoPlayers, ZepetoPlayer, ZepetoCharacter} from 'ZEPETO.Character.Controller'
import * as UnityEngine from 'UnityEngine'
import AnimationLinker from './AnimationLinker'


export default class ClientStarter extends ZepetoScriptBehaviour {

    public multiplay: ZepetoWorldMultiplay
    
    private room: Room

    private static _instance: ClientStarter;
    
    public static get instance(): ClientStarter {
        return this._instance;
    }
    public GetRoom() : Room{
        return this.room
    }

    Awake(){
        UnityEngine.GameObject.DontDestroyOnLoad(this.gameObject)
        ClientStarter._instance = this
    }
    private Start() {

        this.multiplay.RoomCreated += (room: Room) => {
            this.room = room;
        };

        this.multiplay.RoomJoined += (room: Room) => {
            room.OnStateChange += this.OnStateChange;
        };

        this.StartCoroutine(this.SendMessageLoop(UnityEngine.Time.deltaTime));
    }

    // ���� Interval Time���� ��(local)ĳ���� transform�� server�� �����մϴ�.
    private* SendMessageLoop(tick: number) {
        const waitForSeconds = new UnityEngine.WaitForSeconds(tick);
        while (true) {
            yield waitForSeconds;

            if (this.room != null && this.room.IsConnected) {
                const hasPlayer = ZepetoPlayers.instance.HasPlayer(this.room.SessionId);
                if (hasPlayer) {
                    const myPlayer = ZepetoPlayers.instance.GetPlayer(this.room.SessionId);
                    if (myPlayer.character.CurrentState != CharacterState.Idle)
                        this.SendTransform(myPlayer.character.transform);
                }
            }
        }
    }

    private OnStateChange(state: State, isFirst: boolean) {        
        //State가 바뀔 경우 - Animation 포함
        if (isFirst) {
            
            state.players.ForEach((sessionId: string, player: Player) => this.OnJoinPlayer(sessionId, player));
        
            state.players.OnAdd += (player: Player, sessionId: string) => this.OnJoinPlayer(sessionId, player);
    
            state.players.OnRemove += (player: Player, sessionId: string) => this.OnLeavePlayer(sessionId, player);



            // [CharacterController] (Local)Player �ν��Ͻ��� Scene�� ������ �ε�Ǿ��� �� ȣ��
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
                // myPlayer.character.OnChangedState
                myPlayer.character.OnChangedState.AddListener((cur, next) => {
                    this.SendState(next);
                });
                console.log(myPlayer.character.gameObject.layer)
                // myPlayer.character.gameObject.layer = UnityEngine.LayerMask.NameToLayer("LocalPlayer")
                console.log(myPlayer.character.gameObject.layer)
            });

            // [CharacterController] Player �ν��Ͻ��� Scene�� ������ �ε�Ǿ��� �� ȣ��
            ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {
                const isLocal = this.room.SessionId === sessionId;
                if (!isLocal) {
                    const player : Player = this.room.State.players.get_Item(sessionId)
                    player.OnChange += (changeValues) => this.OnUpdateMultiPlayer(sessionId, player)
                }
            });
        }
    }

    private OnJoinPlayer(sessionId: string, player: Player) {
        console.log(`roomSession - ${this.room.SessionId}\nplayerSession - ${player.sessionId}\nsessionId - ${sessionId}`);
        console.log(`[OnJoinPlayer] players - sessionId : ${sessionId}`);
        
        this.StartCoroutine(this.SetAnimation(sessionId, player.animation))

        const spawnInfo = new SpawnInfo();
        const position = this.ParseVector3(player.transform.position);
        const rotation = this.ParseVector3(player.transform.rotation);
        spawnInfo.position = position;
        spawnInfo.rotation = UnityEngine.Quaternion.Euler(rotation);

        const isLocal = this.room.SessionId === player.sessionId;
        ZepetoPlayers.instance.CreatePlayerWithUserId(sessionId, player.zepetoUserId, spawnInfo, isLocal);
    }

    *SetAnimation(sessionId : string, animationName : string){
        while(!ZepetoPlayers.instance.HasPlayer(sessionId)){
            yield null
        }
        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        AnimationLinker.instance.SetAnimation(zepetoPlayer.character.ZepetoAnimator, animationName)
    }

    private OnLeavePlayer(sessionId: string, player: Player) {
        console.log(`[OnRemove] players - sessionId : ${sessionId}`)

        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }

    private OnUpdateMultiPlayer(sessionId: string, player: Player) {

        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        const isAnimate = player.animation !== AnimationLinker.instance.animationName

        if (zepetoPlayer.isLocalPlayer === false) {
            const positionSchema = this.ParseVector3(player.transform.position);
            if(UnityEngine.Vector3.Distance(zepetoPlayer.character.transform.position, positionSchema) > 3){
                zepetoPlayer.character.transform.position = positionSchema
            }
            zepetoPlayer.character.MoveToPosition(positionSchema);
            
            //애니메이션이 변경되었는데 Jump인 경우가 있음 그러면 애니메이션 변경시 점프가 동시에 발생함
            if (!isAnimate && (player.state === CharacterState.JumpIdle || player.state === CharacterState.JumpMove))
                zepetoPlayer.character.Jump();
        }
        
        // 현재 애니메이션 상태가 다른 경우
        // 여기서 문제 생기는거로 예상
        // console.log("서버 플레이어 업데이트")
        
        // 문제해결로 예상   문제 1 - 점프한다 왜...?? - 이유 : 점프 누르면 스테이트가 Jump가 된다. 그리고 버튼을 누르면 State가 Jump인 상태로 여기가 다시 작동한다.
        
        
        // 문제 2 - Local말고 다른 Player에 대해서만 애가 애니메이션 바꿀때 잠시 팔을 핀다 - 이건 진짜 모르겠는데 무언가를 바꾸자마자 흠..
        // 문제 3 - 클라이언트 시작할 때 이미 접속해있는 플레이어들 상태 체크해서 애니메이션 바꿔줘야한다.
        
        // 해결방법 1 - 애니메이션 체크를 매번 한다
        // 해결방법 2 - 시작할 때 체크한다  - AnimationManager가 빈 경우 (기본)
        //애니메이션이 변경된 경우
        if (isAnimate){
            console.log("서버 - 애니메이션 세팅")
            console.log(player.state)
            AnimationLinker.instance.SetAnimation(zepetoPlayer.character.ZepetoAnimator, player.animation)
        }
    }


    private SendTransform(transform: UnityEngine.Transform) {
        const data = new RoomData();

        const pos = new RoomData();
        pos.Add("x", transform.localPosition.x);
        pos.Add("y", transform.localPosition.y);
        pos.Add("z", transform.localPosition.z);
        data.Add("position", pos.GetObject());

        const rot = new RoomData();
        rot.Add("x", transform.localEulerAngles.x);
        rot.Add("y", transform.localEulerAngles.y);
        rot.Add("z", transform.localEulerAngles.z);
        data.Add("rotation", rot.GetObject());
        this.room.Send("onChangedTransform", data.GetObject());
    }
    
    private SendState(state: CharacterState) {
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject());
    }

    SendAnimation(name : string){
        const data = new RoomData();
        data.Add("animation", name);
        this.room.Send("onChangedAnimation", data.GetObject());
    }

    private ParseVector3(vector3: Vector3): UnityEngine.Vector3 {
        return new UnityEngine.Vector3
        (
            vector3.x,
            vector3.y,
            vector3.z
        );
    }
}