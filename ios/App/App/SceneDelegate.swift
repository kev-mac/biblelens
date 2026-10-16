import UIKit
import Capacitor
import WebKit

// Keep native chrome in step with the reader's own light/dark preference.
final class ScriptureBridgeViewController: CAPBridgeViewController, WKScriptMessageHandler {
    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        webView?.scrollView.showsVerticalScrollIndicator = false
        webView?.configuration.userContentController.add(self, name: "scriptureAppearance")
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame,
              message.frameInfo.securityOrigin.protocol == "capacitor",
              message.frameInfo.securityOrigin.host == "localhost",
              let appearance = message.body as? String,
              appearance == "dark" || appearance == "light" else { return }
        let dark = appearance == "dark"
        statusBarStyle = dark ? .lightContent : .darkContent
        let color = dark ? UIColor(red: 5/255, green: 8/255, blue: 14/255, alpha: 1)
                         : UIColor(red: 245/255, green: 248/255, blue: 252/255, alpha: 1)
        webView?.backgroundColor = color
        webView?.scrollView.backgroundColor = color
        setNeedsStatusBarAppearanceUpdate()
    }
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = ScriptureBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}
