 <h1 align="center">
K-디지털 트레이닝 3팀:IoRT 통합 스마트팩토리 혁신 자동입출고 물류 네트워크</h1>

<div align="center" style="font-size:18px"> 
<b>자동 입출고 시스템을 토대로 한 혁신적 스마트팩토리 인프라 구축</b> </div>
<div align="center">
</p>
<p align="center"> 
<img width="825" alt="스크린샷 2025-02-14 오전 10 34 36" src="https://github.com/user-attachments/assets/9ac4bca2-2e1d-4d50-97c1-b13b30e4ec58" />
</div>
<br>

## 📖 Table of Contents
* [Introduce](#-introduce)
* [Feature](#-feature)
* [System Architecture](#-system-architecture)
* [Tech Stack](#-tech-stack)
* [API](#-api)
* [Team Members](#-members)
<br>

## 🎨 Introduce
<table width="1200px">
    <tbody>
        <tr>
            <td width="600" align="center">
                <img width="500" alt="image" src="https://github.com/user-attachments/assets/e65fba07-8bec-4752-989f-9de89f907374">
            </td>
            <td width="700" align="center">
                <div align="left">
                    <br/>
                    <p class="highlight">💻 저희 프로젝트에서는 자동 입출고 시스템을 기반으로 한 혁신적인 스마트팩토리 네트워크를 구축하였습니다!</p>
                    <br>
                    <p>본 프로젝트는 IoRT(Internet of Robotic Things) 기술을 활용하여 효율적이고 지능적인 물류 및 환경 관리 시스템을 구현하는 것을 목표로 합니다.</p>
                    <br>
                    <p>스마트팩토리에서는 자동화, 실시간 데이터 처리, 원격 모니터링 및 지능적인 제어 시스템이 필수 요소입니다. 이를 위해 본 프로젝트에서는 자동 입출고 시스템을 중심으로 다양한 IoT 및 네트워크 기술을 접목하여 최적의 운영 환경을 구축하였습니다.</p>
                </div>
            </td>
        </tr>
    </tbody>
</table>
<br>

 
# 🌈 Feature

### ☁️ 입고 페이지 ☁️ 
1️⃣입고페이지에서 재품이미지와 제품이름 입고할 창고 슬롯을 선택 후 확인 버튼을 누르면 실제로 제품이 입고됩니다!
<table>
<tr>
<td><img src="https://github.com/user-attachments/assets/52dd71d2-ca37-4178-89ad-1b794001933c" alt="입고" width="825px"></td>
</tr>
</table>
<br>

### ☁️ 실제 입고 동영상 ☁️ 
https://github.com/user-attachments/assets/f23cd588-63b1-45d2-934f-897d3b413874


### ☁️ 출고 페이지 ☁️
2️⃣출고페이지에서 출고할 제품을 선택하면 제품이 실제로 출고됩니다!
<table>
<tr>
<td><img src="https://github.com/user-attachments/assets/74ddc449-72df-4980-a870-c177c7ceae40" alt="출고" width="830px"></td>
</tr>
</table>
<br>

### ☁️ 실제 출고 동열상 ☁️
https://github.com/user-attachments/assets/ad3fb807-9659-46b3-9815-d7c3d6048e1e

<br>

### ☁️ 재고 페이지 & 입출고 로그 페이지 ☁️ 
3️⃣재고페이지에서 입출고 로그 버튼을 누르면 제품이름과 입출고 된 시간과 슬롯번호를 확인 할 수 있습니다.
<table>
<tr>
<td><img src="https://github.com/user-attachments/assets/c35b5adf-ad84-4c67-9620-86ea2351d613" alt="로그" width="825px"></td>
</tr>
</table>
<br>
<br>

### ☁️ 노드레드 ☁️
<br>

4️⃣Temperature and Humidity Sensor와 Fan를 사용하여 🌡️온도가 30도 이상이거나 습도 40 이상일 때 💨Fan이 회전합니다!

https://github.com/user-attachments/assets/2cfb6614-fcef-452a-9962-212e50e5602f

<br>

---

<br>

5️⃣Flame Sensor와 Buzzer를 사용하여 🔥화재🔥가 감지되면 🚨Buzzer가 울리고 텔레그램으로 메세지💬가 갑니다!

https://github.com/user-attachments/assets/73038ce5-12e0-4393-8dab-8f229fa9fa46

<br>

<img width="850" alt="System Architecture" src="https://github.com/user-attachments/assets/372995a5-d873-4c27-856e-b8ec1a593600" />

<br>
<br>

## 🛠 System Architecture
<img width="800" alt="System Architecture" src="https://github.com/user-attachments/assets/83b99e54-897a-4837-a6c0-c8466f68a1ae" />
<br>



## 💻 Tech Stack


| 범주 | 사용 기술 |
|:--------:|:------------------------------:|
| **Frontend** | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)  |
| **Backend** | <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/MariaDB-4479A1?style=for-the-badge&logo=mariadb&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/EMQX-0A7EC2?style=for-the-badge&logo=emqx&logoColor=white">  |
| **Hardware** | <img src="https://img.shields.io/badge/Raspberry Pi-C51A4A?style=for-the-badge&logo=Raspberry-Pi&logoColor=white"> <img src="https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white"> |
| **Programming in Raspberry Pi** | <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/Node--RED-8F0000?style=for-the-badge&logo=node-red&logoColor=white"> |
| **Programming in Arduino** | <img src="https://img.shields.io/badge/Arduino IDE-00979D?style=for-the-badge&logo=arduino&logoColor=white"> |

</div>

<br>

---

<br>

| **Category**                      | **Technologies**                                      |
|----------------------------------|---------------------------------------------------|
| **Frontend**                     | React, Vite, TypeScript, TailwindCSS               |
| **Backend**                      | JavaScript, Node.js, Express, MariaDB, EMQX        |
| **Hardware**                     | Raspberry Pi, Arduino                             |
| **Programming & Automation**     | Python, Node-RED, Arduino IDE                     |
| **Database**                      | MariaDB                                          |

<br>

---

<br>
 
## 📗 API

<br>

| 로그 관련 API | 슬롯(창고) 관련 API | 제품 입출고 및 재고 관련 API |
|--------------|------------------|------------------|
| `GET /api/logs` <br> 모든 입출고 로그 데이터를 가져옴 | `GET /api/slots` <br> 모든 슬롯의 상태(점유 여부)를 가져옴 <br> `GET /api/slots/status` <br> 각 슬롯에 저장된 제품의 상태 정보를 가져옴 <br> `POST /api/slots/{slotNumber}/inbound` <br> 특정 슬롯에 제품을 입고 (파일 업로드 포함) <br> `POST /api/slots/{slotNumber}/release` <br> 특정 슬롯의 제품을 출고 | `POST /api/slots/{slotNumber}/inbound` <br> 제품을 특정 슬롯에 입고 (파일 업로드 포함) <br> `POST /api/slots/{slotNumber}/release` <br> 제품을 특정 슬롯에서 출고 |

<br>

---
<br>

## 👨‍💻 Members
<br>
<table>
    <tr>
        <th>Name</th>
        <td>이천우</td>
        <td>김도현</td>
        <td>이승빈</td>
        <td>김용주</td>
        <td>이준원</td>
    </tr>
    <tr>
        <th>Student ID</th>
        <td>2021110034</td>
        <td>2022144038</td>
        <td>2022142045</td>
        <td>2021140009</td>
        <td>2019122035</td>
    </tr>
    <tr>
        <th>Position</th>
        <td>Leader, Frontend, Backend</td>
        <td>Raspberry Pi</td>
        <td>Raspberry Pi</td>
        <td>Arduino</td>
        <td>Arduino</td>
    </tr>
    <tr>
        <th>Department</th>
        <td>기계공학과</td>
        <td>전자공학과</td>
        <td>전자공학과</td>
        <td>전자공학과</td>
        <td>기계설계공학과</td>
    </tr>
</table>
