#include <Servo.h>
#include <SoftwareSerial.h>

// ==================== RobotArm 클래스 ====================
class RobotArm {
  public :
    static const int NUM_SERVOS = 4;
    Servo servos[NUM_SERVOS];
    int servoPins[NUM_SERVOS];
    int initialAngles[NUM_SERVOS];
    
    // 생성자: 서보 핀과 초기 각도를 설정
    RobotArm(const int pins[], const int angles[]) {
      for (int i = 0; i < NUM_SERVOS; i++) {
        servoPins[i] = pins[i];
        initialAngles[i] = angles[i];
      }
    }
    
    // 서보를 해당 핀에 attach하고 초기 각도로 이동
    void attachServos() {
      for (int i = 0; i < NUM_SERVOS; i++) {
        servos[i].attach(servoPins[i]);
        servos[i].write(initialAngles[i]);
      }
    }
    
    // 로봇팔 초기화 (서보를 초기 각도로 이동)
    void initArm() {
      for (int i = 0; i < NUM_SERVOS; i++) {
        servos[i].write(initialAngles[i]);
      }
      Serial.println("Robot arm initialized.");
    }
    
    // 베이스에서 물건 집기 동작
    // 순서:  
    // (1) 집게 열기    -> {105, 40, 70, 30}  
    // (2) 허리 숙이기   -> {105, 130, 90, 30}  
    // (3) 집게 닫기    -> {105, 130, 90, 0}  
    // (4) 허리 펴기     -> {105, 40, 70, 0}

    void basePick() {
      // Step 1: 집게 열기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(45);
      delay(1000);
      
      // Step 2: 허리 숙이기
      servos[0].write(105);
      servos[1].write(125);
      servos[2].write(90);
      servos[3].write(45);
      delay(1000);
      
      // Step 3: 집게 닫기
      servos[0].write(105);
      servos[1].write(125);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);
      
      // Step 4: 허리 펴기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);
      
      Serial.println("베이스에서 물건 집기 동작 완료.");
    }
    
    // 베이스에서 물건 놓기 동작
    // 순서:  
    // (1) 허리 숙이기   -> {105, 125, 90, 0}  
    // (2) 집게 열기    -> {105, 125, 90, 30}  
    // (3) 허리 펴기     -> {105, 40, 70, 30}  
    // (4) 집게 닫기    -> {105, 40, 70, 0}

    void baseDrop() {
      // Step 1: 허리 숙이기
      servos[0].write(105);
      servos[1].write(125);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);
      
      // Step 2: 집게 열기
      servos[0].write(105);
      servos[1].write(125);
      servos[2].write(90);
      servos[3].write(45);
      delay(500);
      
      // Step 3: 허리 펴기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(45);
      delay(1000);
      
      // Step 4: 집게 닫기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);
      
      Serial.println("베이스에서 물건 놓기 동작 완료.");
    }
    
    // 창고에서 물건 집기 동작 (시뮬레이션)
    // 순서:  
    // (1) 집게 열기    -> {105, 40, 70, 60}  
    // (2) 허리 숙이기   -> {105, 100, 90, 60}  
    // (3) 집게 닫기    -> {105, 100, 90, 0}  
    // (4) 허리 펴기     -> {105, 40, 70, 0}

    void warehousePick() {
      // Step 1: 집게 열기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(45);
      delay(1000);
 
      // Step 2: 허리 숙이기 
      servos[0].write(105);
      servos[1].write(100);
      servos[2].write(90);
      servos[3].write(45);
      delay(1000);
      
      // Step 4: 집게 닫기
      servos[0].write(105);
      servos[1].write(100);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);

      // Step 3: 허리 펴기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);
      
      Serial.println("창고에서 물건 집기 동작 완료.");
    }
    
    // 창고에서 물건 놓기 동작
    // 순서:  
    // (1) 허리 숙이기   -> {105, 100, 90, 0}  
    // (2) 집게 열기    -> {105, 100, 90, 60}  
    // (3) 허리 펴기     -> {105, 40, 70, 60}  
    // (4) 집게 닫기    -> {105, 40, 70, 0}
    void warehouseDrop() {
      // Step 1: 허리 숙이기
      servos[0].write(105);
      servos[1].write(100);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);
      
      // Step 2: 집게 열기
      servos[0].write(105);
      servos[1].write(100);
      servos[2].write(90);
      servos[3].write(45);
      delay(1000);
      
      // Step 3: 허리 펴기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(45);
      delay(1000);
      
      // Step 4: 집게 닫기
      servos[0].write(105);
      servos[1].write(50);
      servos[2].write(90);
      servos[3].write(0);
      delay(1000);
      Serial.println("창고에서 물건 놓기 동작 완료.");
    }
};

// ==================== AGV 클래스 ====================
class AGV {
  public:
    int AForward, BForward, ABackward, BBackward;
    // 3 9 11 10
    
    AGV(int aForward, int bForward, int aBackward, int bBackward) :
      AForward(aForward), 
      BForward(bForward), 
      ABackward(aBackward), 
      BBackward(bBackward){
      setupMotors();
    }

    // 모터 핀 설정
    void setupMotors() {
      pinMode(AForward, OUTPUT);
      pinMode(BForward, OUTPUT);
      pinMode(ABackward, OUTPUT);
      pinMode(BBackward, OUTPUT);
      digitalWrite(AForward, LOW);
      digitalWrite(BForward, LOW);
      digitalWrite(ABackward, LOW);
      digitalWrite(BBackward, LOW);
    }

    // 모터 정지
    void stopMotors() {
      setupMotors();
      digitalWrite(AForward, LOW);
      digitalWrite(BForward, LOW);
      digitalWrite(ABackward, LOW);
      digitalWrite(BBackward, LOW);
      delay(300);
    }
    
    // 후진: A1B와 B1A에 motorSpeed 적용
    void forward() {
      setupMotors();
      analogWrite(AForward, 140);
      analogWrite(BForward, 140);
      analogWrite(ABackward, 0);
      analogWrite(BBackward, 0);
      delay(210);
      stopMotors();
    }

    // 전진: A1A와 B1B에 motorSpeed 적용
    void backward() {
      setupMotors();
      analogWrite(AForward, 0);
      analogWrite(BForward, 0);
      analogWrite(ABackward, 140);
      analogWrite(BBackward, 140);
      delay(250);
      stopMotors();
    }
  
  

    // AGV 이동: units 단위만큼 전진(양수) 또는 후진(음수)
     void move(int units) {
       if (units >= 0) {
         for (int i = 0; i < (units*1); i++) {
           forward();
           delay(200);
         }
       } 
       else if (units < 0) {
         for (int i = 0; i < -(units*1); i++) {
           backward();
           delay(200);
         }
       }
       stopMotors();
    }
    // void move(int units){
    //   if (units = 1){
    //     for (int i = 0; i < (units*1); i++){
    //       forward();
    //       delay(200);
    //     }
    //   }
    //   stopMotors();
      
    //   else if (units = 2){
    //       for (int i = 0; i < (units*2); i++){
    //         forward();
    //         delay(200);
    //       }
    //   }
    // }
};

// ==================== 커맨드 관련 구조체 및 전역 변수 ====================

// 커맨드 구조체: x (동작 종류, 0: 베이스, 1: 창고), y (AGV 이동 단위; 50cm 단위)
struct Command {
  int x;
  int y;
};

// AGV의 현재 y 위치 (50cm 단위, 초기값 0)
int currentY = 0;

// SoftwareSerial 객체 (블루투스 통신)
int RX = 2;
int TX = 0;
SoftwareSerial bluetooth(RX, TX);

// 전역 RobotArm, AGV 인스턴스 (setup()에서 생성)
RobotArm* robotArm;
AGV* agv;

// 단일 명령어 문자열 "x,y"를 파싱하여 Command 구조체로 반환하는 함수
Command parseSingleCommand(String s) {
  Command c;
  int commaIndex = s.indexOf(',');
  if (commaIndex == -1) {
    c.x = -1;
    c.y = 0;
    return c;
  }
  String xStr = s.substring(0, commaIndex);
  String yStr = s.substring(commaIndex + 1);
  c.x = xStr.toInt();
  c.y = yStr.toInt();
  return c;
}


// 단일 커맨드 처리 함수
void executeCommand(Command command) {
  int storage_num = command.y;
  if (command.x == 0) { // 입고인 경우
    // 1. 로봇팔 초기화 
    robotArm->initArm();
    Serial.println("로봇팔 초기화 실행 중.");
    Serial.print("(0, ");
    Serial.print(command.y);
    Serial.println(") 실행중.");
    delay(500);

    // 2. 로봇팔 동작 (베이스에서 집기)
    robotArm->basePick();
    Serial.println("입고 물품 집는 중.");
    delay(500);

    // 3. AGV 이동 (창고 위치로 이동)
    agv->move(storage_num);
    currentY += storage_num;
    Serial.print("창고로 이동 중\n");
    Serial.print("현재 AGV 위치 : ");
    Serial.println(currentY);
    delay(500);

    // 4. 로봇팔 동작 (창고에 놓기)
    robotArm->warehouseDrop();
    Serial.println("입고 물품 놓는 중");
    delay(500);

    // 5. AGV 이동(베이스로 복귀)
    agv->move(-(storage_num));
    currentY -= storage_num;
    Serial.print("현재 AGV 위치 : ");
    Serial.println(currentY);
    delay(500);

    // 6. 로봇팔 초기화
    robotArm->initArm();
    Serial.println("로봇팔 초기화 실행 중.");
    Serial.print("(0, ");
    Serial.print(command.y);
    Serial.println(") 실행완료.");
  }
  else if (command.x == 1) { // 출고인 경우
    // 1. 로봇팔 초기화
    robotArm->initArm();
    Serial.println("로봇팔 초기화 실행 중.");
    Serial.print("(1, ");
    Serial.print(command.y);
    Serial.println(") 실행중.");
    delay(500);
    
    // 2. AGV 이동(창고 위치로 이동)
    agv->move(storage_num);
    currentY += storage_num;
    Serial.print("현재 AGV 위치 : ");
    Serial.println(currentY);
    delay(500);
    
    // 3. 로봇팔 동작(창고에서 집기)
    robotArm->warehousePick();
    Serial.print("출고 물품 집는 중");
    delay(500);
    
    // 4. AGV 이동(베이스로 이동)
    agv->move(-(storage_num));
    currentY -= storage_num;
    Serial.print("현재 AGV 위치 : ");
    Serial.println(currentY);
    delay(500);
    
    // 5. 로봇팔 동작(베이스에 놓기)
    robotArm->baseDrop();
    Serial.print("출고 물품 놓는 중");
    delay(500);
    
    // 6. 로봇팔 초기화
    robotArm->initArm();
    Serial.println("로봇팔 초기화 실행 중.");
    Serial.print("(1, ");
    Serial.print(command.y);
    Serial.println(") 실행완료.");
  }
}


// 다중 명령어 문자열 처리 함수
// 항상 for문을 이용하여 문자열 내의 모든 명령어(괄호로 감싸진 부분)를 추출하여 실행합니다.
void processCommand(String commandStr) {
    // 앞뒤 공백 제거
    commandStr.trim();
    
    // 외부의 바깥 괄호 제거: "(( ... ))" 형태이므로 가장 바깥 괄호 한 쌍 제거
    if (commandStr.startsWith("(") && commandStr.endsWith(")")) {
        commandStr = commandStr.substring(1, commandStr.length() - 1);
    }
    
    int startIndex = 0;
    
    // 문자열 내의 모든 ( ) 쌍을 찾아서 명령어를 처리
    while (true) {
        // 여는 괄호 찾기
        int openIdx = commandStr.indexOf('(', startIndex);
        if (openIdx == -1) break;  // 더 이상 여는 괄호가 없으면 종료
        
        // 닫는 괄호 찾기
        int closeIdx = commandStr.indexOf(')', openIdx);
        if (closeIdx == -1) break; // 닫는 괄호가 없으면 종료
        
        // 괄호 사이의 문자열 추출 (예: "x, y")
        String singleCmd = commandStr.substring(openIdx + 1, closeIdx);
        singleCmd.trim();
        
        // 단일 명령어를 파싱하여 Command 객체 생성 (parseSingleCommand 함수가 존재한다고 가정)
        Command cmd = parseSingleCommand(singleCmd);
        
        // 해당 명령어 실행
        executeCommand(cmd);
        
        // 닫는 괄호 다음 인덱스부터 다시 검색
        startIndex = closeIdx + 1;
    }
}



// ================ setup 함수 ================

void setup() {

  Serial.begin(9600);
  bluetooth.begin(9600);
  
  // AGV 인스턴스 생성 (모터 핀, 속도)
  agv = new AGV(3, 4, 5, 7);
  agv->setupMotors();
  agv->stopMotors(); // 모터 정지

  // RobotArm 인스턴스 생성 (서보 핀 및 초기 각도)
  int pins[RobotArm::NUM_SERVOS] = {8, 11, 12, 13};
  int initAngles[RobotArm::NUM_SERVOS] = {105, 40, 90, 0};
  robotArm = new RobotArm(pins, initAngles);
  robotArm->attachServos();
  
  Serial.println("시스템 초기화 완료.");
}

// ================ loop 함수 ================

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    processCommand(command);
  }
  if (bluetooth.available() > 0) {
    String command = bluetooth.readStringUntil('\n');
    processCommand(command);
  }

}

