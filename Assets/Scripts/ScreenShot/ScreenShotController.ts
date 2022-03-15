import { Camera, RenderTexture } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldContent } from 'ZEPETO.World'

export default class ScreenShotController extends ZepetoScriptBehaviour {

    public camera : Camera
    public renderTexture : RenderTexture



    public TakeScreenShot(){
        this.camera.targetTexture = this.renderTexture
        this.camera.Render()
        this.camera.targetTexture = null
    }

    // Screenshot Result 
    // 1. Btn: 스크린샷 저장 - 스크린샷을 갤러리에 저장합니다. 
    // 2. Btn: 스크린샷 공유 - 스크린샷을 공유할 수 있는 기능입니다.
    // 3. Btn: 피드 올리기 - 피드에 올리는 기능입니다.
    
    
    public SaveScreenShot(){
        ZepetoWorldContent.SaveToCameraRoll(this.renderTexture, (result: boolean) => { console.log(`스크린샷 저장 결과 : ${result}`) });
    }

    public ShareScreenShot() {
        ZepetoWorldContent.Share(this.renderTexture, (result: boolean) => { console.log(`스크린샷 공유 결과 : ${result}`) });
    }

    public CreateFeedScreenShot() {
        ZepetoWorldContent.CreateFeed(this.renderTexture, "테스트", (result: boolean) => {
            console.log(`피드 생성 결과 : ${result}`)
        });
    }
}