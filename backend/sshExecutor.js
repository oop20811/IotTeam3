// sshExecutor.js
const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();

// Raspberry Pi SSH 연결 정보
const sshConfig = {
  host: "192.168.0.7", // Raspberry Pi의 IP 주소
  port: 22, // 기본 SSH 포트
  username: "pi", // 사용자 이름
  password: "1234", // 비밀번호
};

// 실행할 Python 스크립트 경로
const pythonScriptPath = "/home/pi/bluetooth1.py";

// Node-RED 실행 명령어
// (노드레드가 설치되어 있고 환경변수나 경로 설정이 되어 있어야 합니다.)
const nodeRedCommand = `nohup node-red > /dev/null 2>&1 &`;

async function startServicesDetached() {
  try {
    // SSH 연결
    await ssh.connect(sshConfig);
    console.log(
      "SSH 연결 성공, Python 스크립트와 Node-RED를 백그라운드에서 실행합니다."
    );

    // Python 스크립트 실행 (detached 모드)
    const pythonCommand = `nohup python3 ${pythonScriptPath} > /dev/null 2>&1 &`;
    const pythonResult = await ssh.execCommand(pythonCommand);
    console.log("Detached Python script 실행 명령 전송 완료.", pythonResult);

    // Node-RED 실행 (detached 모드)
    const nodeRedResult = await ssh.execCommand(nodeRedCommand);
    console.log("Detached Node-RED 실행 명령 전송 완료.", nodeRedResult);
  } catch (error) {
    console.error("SSH 연결 또는 서비스 실행 실패:", error);
  } finally {
    ssh.dispose();
  }
}

// 서비스를 시작합니다.
startServicesDetached();
