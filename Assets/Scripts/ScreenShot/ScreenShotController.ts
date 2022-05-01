import { Camera, GameObject, RenderTexture, WaitForEndOfFrame } from 'UnityEngine'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldContent } from 'ZEPETO.World'
import SS_UIController from './SS_UIController'

export default class ScreenShotController extends ZepetoScriptBehaviour {

    private camera : Camera

    public renderTexture : RenderTexture

    public UIControllerObject : GameObject
    private UIController : SS_UIController
    Start(){
        this.UIController = this.UIControllerObject.GetComponent<SS_UIController>()
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.camera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })
    }

    public SetScreenShotCamera(camera: Camera) {
        this.camera = camera
    }

    public TakeScreenShot(){
        this.camera.targetTexture = this.renderTexture
        this.StartCoroutine(this.RenderTargetTexture())
    }

    // Screenshot Result 
    // 1. Btn: 스크린샷 저장 - 스크린샷을 갤러리에 저장합니다. 
    // 2. Btn: 스크린샷 공유 - 스크린샷을 공유할 수 있는 기능입니다.
    // 3. Btn: 피드 올리기 - 피드에 올리는 기능입니다.
    
    
    public SaveScreenShot(){
        ZepetoWorldContent.SaveToCameraRoll(this.renderTexture, (result: boolean) => {
            console.log(`스크린샷 저장 결과 : ${result}`)
            this.UIController.StartCoroutine(this.UIController.ShowToastMessage(this.UIController.TOAST_MESSAGE.screenShotSaveCompleted))
        });
    }

    public ShareScreenShot() {
        ZepetoWorldContent.Share(this.renderTexture, (result: boolean) => {
            console.log(`스크린샷 공유 결과 : ${result}`)
        });
    }

    public CreateFeedScreenShot() {
        this.UIController.StartCoroutine(this.UIController.ShowToastMessage(this.UIController.TOAST_MESSAGE.feedUploading))
        ZepetoWorldContent.CreateFeed(this.renderTexture, "테스트", (result: boolean) => {
            this.UIController.ShowCreateFeedResult(result)
            console.log(`피드 생성 결과 : ${result}`)
        });
    }

    *RenderTargetTexture()
    {
        yield new WaitForEndOfFrame();
        this.camera.Render();
        this.camera.targetTexture = null;
    }
}