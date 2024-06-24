const computedBehavior = require('miniprogram-computed').behavior
import utils from '../../utils/index'

Component({
	behaviors: [computedBehavior],
	properties: {
		popupShow: {
			type: Boolean,
			value: false
		}
	},
	data: {
		privacyText: ''
	},
	watch: {
		'popupShow': function(popupShow) {
			if (popupShow === true && !this.data.privacyText) {
				this.queryPrivacy()
			}
		}
	},
	methods: {
		triggerAgreement(e) {
			const {field} = e.currentTarget.dataset
			this.triggerEvent('chooseagreement', {
				agree: field
			})
		},
		closePopup() {
			this.setData({
				popupShow: false
			})
		},
		async queryPrivacy() {
			try {
				const res = '<p> &nbsp; &nbsp; &nbsp; 我司深知个人信息对您而言的重要性，也感谢您对我们的信任。我们将通过本政策向您说明医院及我们会如何收集、存储、保护、使用及对外提供您的信息，并说明您享有的权利，其中要点如下：</p><p> &nbsp; &nbsp;1、为了便于您了解您在使用我们的服务时，我们需要收集的信息类型与用途，我们将结合具体服务向您逐一说明。 </p><p> &nbsp; &nbsp;2、为了向您提供服务所需，我们会按照合法、正当、必要的原则收集您的信息。我们只会在您使用特定业务功能时，仅收集为了正常运行该业务功能所必须的信息，在您停止该业务功能的使用后，我们将会停止您的个人信息收集的行为。 </p><p> &nbsp; &nbsp;3、如果为了向您提供服务而需要将您的信息共享至第三方，我们将评估该第三方收集信息的合法性、正当性、必要性。我们将要求第三方对您的信息采取保护措施并且严格遵守相关法律法规与监管要求。另外，我们会按照法律法规及国家标准的要求以确认协议、具体场景下的文案确认、弹窗提示等形式征得您的同意或确认第三方已经征得您的同意。 </p><p> &nbsp; &nbsp;4、您可以通过本政策介绍的方式访问和管理您的信息、注销账号或进行投诉举报。您可以根据以下索引阅读相应章节，进一步了解本政策的具体约定： </p><p> &nbsp; &nbsp;一、信息收集与使用 </p><p> &nbsp; &nbsp;二、使用Cookie、Proxy等技术 </p><p> &nbsp; &nbsp;三、对外提供信息 </p><p> &nbsp; &nbsp;四、信息存储与保护 </p><p> &nbsp; &nbsp;五、访问和管理自己的信息 </p><p> &nbsp; &nbsp;六、保护未成年人的信息 </p><p> &nbsp; &nbsp;七、本政策的适用与更新 </p><p> &nbsp; &nbsp;八、联系我们 </p><p> &nbsp; &nbsp;我们尊重并保护您的隐私。您使用我们的服务时，我们将按照医院小程序用户隐私政策条款(以下简称“本政策”)收集、存储、使用及对外提供您的个人信息。同时，我们会通过本政策向您说明，我们如何为您提供访问、更新、控制和保护您信息的服务。本政策与您使用我们的服务关系紧密，我们建议您仔细阅读并理解本政策全部内容，做出您认为适当的选择。为了遵守国家法律法规及监管规定(例如：进行实名制管理、安全管理)，也为了向您提供服务及提升服务质量，我们需要收集、存储、使用及对外提供您的信息。您同意我们按照本政策约定处理您的信息，以便您享受优质、便捷、个性化的服务，同时更好地保护您的账户安全。</p><p> &nbsp; &nbsp;一、信息收集与使用 </p><p> &nbsp; &nbsp;为了您可以正常使用医院小程序服务，在下列情形中我们需要收集您的一些信息，用以向您提供服务、提升我们的服务质量、保障您的账户和资金安全以及执行国家法律法规及监管规定： </p><p> &nbsp; &nbsp;1、依据法律法规及监管规定履行反洗钱义务及进行实名制管理 </p><p> &nbsp; &nbsp;在您注册小程序账户或使用小程序服务时，您需提供手机号码作为账户登录名。 </p><p> &nbsp; &nbsp;2、普通服务场景 </p><p> &nbsp; &nbsp;在使用小程序服务过程中，我们会按照合法、正当、必要的原则收集您的信息。在您使用预约挂号、门诊缴费，住院预缴等服务时，我们会收集您的身份信息(包括证件类型、证件号码、姓名、性别、民族)、手机号码、住址、银行账号、交易信息；使用实名认证服务时，我们会对您进行人脸识别、OCR上传证件、收集您的电子签名、视频影像信息，如您不提供前述信息，对应服务可能无法进行，但不影响您使用我们提供的其他服务。 </p><p> &nbsp; &nbsp;3、身份验证 </p><p> &nbsp; &nbsp;(1)登录验证 </p><p> &nbsp; &nbsp;为了让您更安全、便捷地使用小程序，您可选择我们提供的刷脸登录服务，向我们提供您的脸部图像或视频，以核验您的身份。 </p><p> &nbsp; &nbsp;(2)重要操作行为验证</p><p> &nbsp; &nbsp;为了保障您的账户和资金安全，在您进行一些重要的账户操作时(例如：找回密码、安全证书安装)，我们需要验证您的身份，为此您可能需向我们提供姓名、手机号码、证件类型、证件号码、脸部图像、取款密码、短信验证码及其他在具体业务开展过程中基于您的同意而收集的可识别您身份的证明资料；如您不同意提供前述信息，您将无法完成特定操作，但不影响您使用我们提供的其他服务； </p><p> &nbsp; &nbsp;(3)支付指令验证</p><p> &nbsp; &nbsp;您在使用支付账户进行交易时，我们需要对您的身份进行验证，以确保您的账户与资金安全。如您不同意提供前述信息，则可能无法完成交易，但不影响您使用我们提供的其他服务</p><p> &nbsp; &nbsp;4、语音输入您可以选择开启手机的麦克风权限，使用麦克风设备来进行语音输入，在使用过程中我们需要收集您的语音内容并进行必要的处理；如您不提供前述信息，我们将无法为您提供语音相关服务，但不影响您使用我们提供的服务；</p><p> &nbsp; &nbsp;5、基于位置信息的服务推荐您可以选择开启手机的定位权限，用于提供您的位置信息，以便您基于所在地点位置接受服务推荐；如您不提供前述信息，您将不会收到该服务推荐，但不影响您使用我们提供的其他服务。</p><p> &nbsp; &nbsp;6、根据相关法律法规及国家标准，在以下情形中，我们可能会依法收集并使用您的个人信息无需征得您的授权同意：</p><p> &nbsp; &nbsp;1)与国家安全、国防安全有关的；</p><p> &nbsp; &nbsp;2)与公共安全、公共卫生、重大公共利益有关的；</p><p> &nbsp; &nbsp;3)与犯罪侦查、起诉、审判和判决执行等有关的；</p><p> &nbsp; &nbsp;4)根据您的要求签订和履行合同所必需的；</p><p> &nbsp; &nbsp;5)出于维护您或他人的生命安全等重大合法权益但又很难得到您本人同意的；</p><p> &nbsp; &nbsp;6)所收集的用户信息是您自行向社会公众公开的；</p><p> &nbsp; &nbsp;7)从合法公开披露的信息中收集用户信息，如合法的新闻报道、政府信息公开等渠道；</p><p> &nbsp; &nbsp;8)用于维护服务的安全和合规所必需的，例如发现、处置产品和服务的故障；</p><p> &nbsp; &nbsp;9)法律法规规定的其他情形。</p><p> &nbsp; &nbsp;7、此外，您在使用小程序对应服务时可能需要调用或使用您的设备功能用于收集和使用您的个人信息。当您使用服务之前，您可选择是否授权我们开通以下权限：</p><p> &nbsp; &nbsp;1)基于摄像头(相机)的功能：您可开启摄像头进行身份校验(身份证识别及人脸识别)、银行卡识别、拍照并上传图片操作以及使用视频服务；</p><p> &nbsp; &nbsp;2)基于相册的功能：当您进行身份认证需要提交证明材料时，您可从本地相册中选择图片上传；</p><p> &nbsp; &nbsp;3)基于地理位置的功能：您可开启定位服务，以便在来院导航、护理预约等功能中获得更好的体验；</p><p> &nbsp; &nbsp;4)基于麦克风的功能：您可选择麦克风设备来进行在线问诊的语音输入与沟通(语音搜索、语音消息)或视频对话；</p><p> &nbsp; &nbsp;5)基于电话的功能：您在使用电话咨询服务时，可一键拨打医生电话号码咨询病情，开启该功能将避免您手动重复填写网点电话号码；</p><p> &nbsp; &nbsp;6)基于微信的功能：您在使用小程序个人中心时，需获取您的微信昵称、头像、地区，性别等信息；</p><p> &nbsp; &nbsp;上述功能需要您在您的设备中向我们开启您的摄像头(相机)、相册、地理位置(定位)、麦克风等功能的访问权限，以实现这些功能所涉及的信息收集和使用。您确认并同意开启这些权限即代表您授权我们可以收集和使用这些信息；您也可以遵循您所使用设备的操作系统指示变更或者取消这些授权，则我们将不再继续收集和使用您的这些信息，也无法为您提供上述与这些授权所对应的功能，但这不会对您使用小程序其他服务产生影响。</p><p> &nbsp; &nbsp;8、其他</p><p> &nbsp; &nbsp;请您理解，我们向你提供的服务是不断更新和发展的。如您选择使用了前述说明当中尚未涵盖的其他服务，基于该服务我们需要收集您的信息的，我们会通过页面提示、交互流程或协议约定的方式另行向您说明信息收集的范围与目的，并征得您的同意。我们会按照本政策以及相应的用户协议约定使用、存储、对外提供和保护您的信息；如您选择不提供前述信息，您可能无法使用某项或某部分服务，但不影响您使用我们提供的其他服务。此外，第三方主体可能会通过口袋银行APP向您提供服务。当您进入第三方主体运营的服务页面时，请注意相关服务由第三方主体向您提供。涉及到第三方主体向您收集个人信息的，建议您仔细查看第三方主体的隐私政策或协议约定。</p><p> &nbsp; &nbsp;二、使用Cookie、Proxy等技术</p><p> &nbsp; &nbsp;为使您获得更轻松的访问体验，您访问小程序提供的服务时，我们可能会通过小型数据文件识别您的身份，这么做可帮您省去重复输入注册信息的步骤，或者帮助判断您的账户安全状态。这些数据文件可能是Cookie，Flash Cookie， 您的浏览器或关联应用程序提供的其他本地存储(以下简称“Cookie”)。请您理解，我们的某些服务只能通过使用Cookie才可得到实现。如您的浏览器或浏览器附加服务允许，您可以修改对Cookie的接受程度或者拒绝小程序的Cookie。多数浏览器工具条中的“帮助”部分会告诉您怎样防止您的浏览器接受新的Cookie，怎样让您的浏览器在您收到一条新Cookie时通知您或者怎样彻底关闭Cookie。此外，您可以通过改变浏览器附加程序的设置，或通过访问提供商的网页，来关闭或删除浏览器附加程序使用的Flash Cookie及类似数据。但这一举动在某些情况下可能会影响您安全访问小程序提供的服务。</p><p> &nbsp; &nbsp;三、对外提供信息</p><p> &nbsp; &nbsp;1、对外提供信息</p><p> &nbsp; &nbsp;1)共享除以下情形外，未经您同意，我们不会与任何第三方共享您的个人信息。我们仅会出于合法、正当、必要、特定、明确的目的共享您的信息。对我们与之共享信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本《隐私政策》以及其他任何相关的保密和安全措施来处理信息。</p><p> &nbsp; &nbsp;2)向您提供我们的服务：我们可能向合作伙伴及其他第三方共享您的信息，以实现您需要的核心功能或提供您需要的服务，第三方包括我们的关联公司、合作金融机构以及其他合作伙伴。</p><p> &nbsp; &nbsp;3)维护和改善我们的服务：我们可能向合作伙伴及其他第三方共享您的信息，以帮助我们为您提供更有针对性、更完善的服务，因此，只有共享您的信息，才能提供您需要的产品或服务。</p><p> &nbsp; &nbsp;4)向委托我们进行推广的合作伙伴第三方共享，但我们仅会向这些委托方提供推广的覆盖面和有效性的信息，我们可能与其共享活动过程中产生的、为完成活动所必要的信息，以便第三方能及时向您发放奖品或为您提供服务，我们会依据法律法规或国家标准的要求，在活动规则页面或通过其他途径向您明确告知需要向第三方提供何种信息。</p><p> &nbsp; &nbsp;2、安全</p><p> &nbsp; &nbsp;1)我们重视您的信任，对于您提供的个人信息，我们努力使用商业上可接受的方法仁护信息的安全性和保密包括但不限于：防火墙和数据备份措施；数据中心的访问权限限制；对移动终端的识别性信息进行加密处理等。我们已经建立健全数据安全管理体系，包括对用户信息进行分级分类、加密保存、数据访问权限划分，指定内部数据管理制度和操作规程，从数据的获取、使用、销毁都有严格的流程要求，避免用户隐私数据被非法使用。</p><p> &nbsp; &nbsp;2)我们会采取一切合理可行的措施，确保未收集无关的个人信息。我们只会在达成本政策所述目的所需的期限内保留您的个人信息，除非需要延长保留或受到法律的允许。另外请您理解，根据目前技术水平，在互联网上没有任何传输方法或电子存储方法是100%安全可靠的，所以我们无法保证它的绝对安全。</p><p> &nbsp; &nbsp;3、转让</p><p> &nbsp; &nbsp;我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：</p><p> &nbsp; &nbsp;(1)事先获得您的明确同意；</p><p> &nbsp; &nbsp;(2)根据法律法规或强制性的行政或司法要求；</p><p> &nbsp; &nbsp;(3)在涉及资产转让、收购、兼并、重组或破产清算时，如涉及到个人信息转让，我们会向您告知有关情况，并要求新的持有您的个人信息的公司、组织继续受本政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。</p><p> &nbsp; &nbsp;4、公开披露</p><p> &nbsp; &nbsp;原则上我们不会将您的信息进行公开披露，但经您另行明确同意的除外。</p><p> &nbsp; &nbsp;四、信息存储与保护</p><p> &nbsp; &nbsp;小程序将对相关信息通过专业技术手段采取加密存储与传输，保障您个人信息的安全：</p><p> &nbsp; &nbsp;1、我们在中华人民共和国境内收集和产生的个人信息将存储在中华人民共和国境内。若为处理跨境业务且经您授权，向境外机构传输境内收集的相关个人信息的，我们会按照法律、行政法规和相关监管部门的规定执行，向您说明个人信息处境的目的以及涉及的个人信息类型，征得您的同意，并通过签订协议、现场核查等有效措施，要求境外机构为所获得的个人信息保密。我们仅在本政策所述目的所必需期间和法律法规要求的时限内保留您的个人信息。超出必要期限后，我们将对您的个人信息进行删除或匿名化处理，但法律法规另有规定的除外。</p><p> &nbsp; &nbsp;2、为保障您的信息安全，我们建立数据存储及使用安全规范，通过三个方面来强化数据安全：用户的分类分级、用户数据的分类分级及数据输出环境。依据不同的用户、不同的用户数据、不同的数据输出环境，采用不用的数据安全处理方式。</p><p> &nbsp; &nbsp;3、我们致力于使用各种安全技术及配套的管理体系来防止您的信息被泄露、毁损或者丢失，如通过网络安全层软件(SSL)进行加密传输、信息加密存储、数据脱敏、严格限制数据中心的访问、使用专用网络通道及网络代理。</p><p> &nbsp; &nbsp;4、我们设立了用户信息保护责任部门，建立了相关内控制度，对可能接触到您的信息的工作人员采取最小够用授权原则；对工作人员处理您的信息的行为进行系统监控，不断对工作人员培训相关法律法规及隐私安全准则和安全意识强化宣导，并每年组织全体工作人员参加安全考试。另外，我们每年还会聘请外部独立第三方对我们的信息安全管理体系进行评估。</p><p> &nbsp; &nbsp;5、请您理解，由于技术水平限制及可能存在的各种恶意手段，有可能因我们可控范围外的因素而出现问题。在不幸发生用户信息安全事件后，我们将按照法律法规的，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以邮件、信函、电话或推送通知方式告知您，难以逐一告知用户信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报用户信息安全事件的处置情况。</p><p> &nbsp; &nbsp;6、如我们停止运营，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知您，对所持有的个人信息进行删除或匿名化处理。</p><p> &nbsp; &nbsp;五、访问和管理自己的信息</p><p> &nbsp; &nbsp;在您使用小程序服务期间，为了您可以更加便捷地访问和管理您的信息，同时保障您注销账户的权利，我们在客户端中为您提供了相应的操作设置，您可以参考下面的指引进行操作。</p><p> &nbsp; &nbsp;1、管理您的信息您可进入小程序，在“我的-&gt;就诊卡”、“我的-&gt;电子健康卡”中：查阅您的身份信息、账户信息以及绑定的卡信息。为了您的个人信息安全，您的身份证号码会进行脱敏展示。</p><p> &nbsp; &nbsp;2、您可通过如下路径注销账户：打开小程序，通过“我的-&gt;就诊卡-&gt;注销解绑”。当您符合约定的账户注销条件并注销账户后，您该账户内的所有信息将被清空，我们将不会再收集、使用或对外提供与该账户相关的个人信息，但您在使用小程序服务期间提供或产生的信息我们仍需按照监管要求的时间进行保存，且在该保存的时间内依法配合有权机关的查询。</p><p> &nbsp; &nbsp;3、如您发现我们收集、使用您的个人信息的行为，违反了法律法规规定或违反了与您的约定，您可联系我们通过意见反馈功能，要求删除相应的信息。</p><p> &nbsp; &nbsp;4、尽管有上述约定，但按照相关法律法规及国家标准，在以下情形中，我们可能无法响应您的请求：</p><p> &nbsp; &nbsp;(1)与国家安全、国防安全直接相关的；</p><p> &nbsp; &nbsp;(2)与公共安全、公共卫生、重大公共利益直接相关的；</p><p> &nbsp; &nbsp;(3)与犯罪侦查、起诉、审判和执行判决等直接相关的；</p><p> &nbsp; &nbsp;(4)有充分证据表明您存在主观恶意或滥用权利的；</p><p> &nbsp; &nbsp;(5)响应您的请求将导致其他个人、组织的合法权益受到严重损害的；</p><p> &nbsp; &nbsp;(6)涉及商业秘密的。</p><p> &nbsp; &nbsp;六、保护未成年人的信息</p><p> &nbsp; &nbsp;1、我们期望父母或监护人指导未成年人使用我们的服务。我们将根据国家相关法律法规的规定保护未成年人信息的保密性及安全性。</p><p> &nbsp; &nbsp;2、如您为未成年人，建议请您的父母或监护人阅读本政策，并在征得您父母或监护人同意的前提下使用我们的服务或向我们提供您的信息。对于经父母或监护人同意而收集您的信息的情况，我们只会在法律的允许、父母或监护人明确同意或者保护您的权益所必要的情况喜爱使用或公开披露此信息。如您的监护人不同意您按照本政策使用我们的服务或向我们提供信息，请您立即终止使用我们的服务并及时通知我们，以便我们采取相应的措施。</p><p> &nbsp; &nbsp;3、如您为未成年人的父母或监护人，当您对您所监护的未成年人的信息处理存在疑问时，请通过下文中的联系方式联系我们。</p><p> &nbsp; &nbsp;七、本政策的适用及更新</p><p> &nbsp; &nbsp;我公司智慧医院及互联网医院小程序所有服务均适用本政策。基于业务功能、使用规则、联络方式、保存地域变更或法律法规及监管重 我们可能会适时对本政策进行修订。由于用户较多，如本政策发生变更，我们将以推送通知发布公告的方式来通知您。若您在本政策修订后继续服务，这表示您已充分阅读、理解并接受修订后的本政策并愿意受修订后的本政策约束。您可以在小程序个人中心通过“我的-更多”中查看本政策。我们鼓励您在每次访问时都查阅我们的隐私政策。</p>'
				this.setData({
					privacyText: res
				})
			} catch (e) {
				console.log(e)
			}
		}
	}
})
