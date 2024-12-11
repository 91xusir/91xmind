const { execSync } = require("child_process");
const path = require("path");
const os = require("os");
const { Console } = require("console");

// 获取当前脚本所在目录
const scriptPath = __dirname;
const xmindHookPath = path.join(scriptPath, "xmind_hook");
const xmindCliPath = path.join(scriptPath, "xmindcli");
const xmindAdminPath = path.join(scriptPath, "auth_admin");
const xmindApiPath = path.join(scriptPath, "auth_api");

// 执行命令的函数
function runCommand(command, cwd = null) {
  try {
    const result = execSync(command, { cwd, stdio: "pipe" });
    console.log(result.toString()); // 输出命令执行结果
  } catch (error) {
    console.error(`命令执行失败: ${error.cmd}`);
    console.error(`错误信息: ${error.stderr}`);
    throw error;
  }
}

// 编译hook文件
function buildHook() {
  runCommand("npm install", xmindHookPath); // 在xmind_hook目录下运行npm install
  runCommand("npm run build", xmindHookPath); // 在xmind_hook目录下运行npm run build
}

// 编译xmindcli
function buildXmindcli() {
  const currentDate = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15); // 获取当前时间
  process.env.GOARCH = "amd64";
  process.env.GOOS = "windows";
  let command = `go build -o ../bin/xmindcli_win_amd64_${currentDate}.exe -gcflags=-trimpath=$GOPATH -asmflags=-trimpath=$GOPATH -ldflags -w ${xmindCliPath}/cmd`;
  runCommand(command, xmindCliPath);
  // 设置为Darwin平台（macOS）
  process.env.GOOS = "darwin";
  command = `go build -o ../bin/xmindcli_darwin_amd64_${currentDate} -gcflags=-trimpath=$GOPATH -asmflags=-trimpath=$GOPATH -ldflags -w ${xmindCliPath}/cmd`;
  runCommand(command, xmindCliPath);
  console.log("xmindcli Build succeeded!");
  console.log("output path: " + path.join(xmindCliPath, "../bin"));
}

// 编译xmind_admin
function buildXmindAdmin() {
  runCommand("npm install", xmindAdminPath); // 在xmind_admin目录下运行npm install
  runCommand("npm run build", xmindAdminPath); // 在xmind_admin目录下运行npm run build
  console.log("请依次输入命令:");
  console.log(`cd ${xmindAdminPath} & npx wrangler pages project create`);
  console.log("npx wrangler pages deploy dist");
  process.exit(0); // 退出程序
}

// 编译xmind_api
function buildXmindApi() {
  runCommand("npm install", xmindApiPath); // 在xmind_api目录下运行npm install
  runCommand("npx wrangler d1 create d1-xmind", xmindApiPath); // 创建d1
  runCommand("npx wrangler d1 execute d1-xmind --file=./src/db/db.sql", xmindApiPath); // 创建d1
  Console.log(
    "请将生成的 database_id 类似于【xxxxxxxx-xxxx-xxxx-93ba-5025ba4fb5c5】替换到auth_api\\wrangler.toml"
  );
  Console.log("然后再执行:");
  Console.log(`cd ${xmindApiPath} & npx wrangler deploy --minify src/index.ts`);
  process.exit(0); // 退出程序
}

// 用Promise封装标准输入
function promptUser(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

// 主菜单
async function mainMenu() {
  while (true) {
    console.log("1. 编译hook文件");
    console.log("2. 编译xmindcli");
    console.log("3. 编译xmind_admin");
    console.log("4. 编译xmind_api");
    console.log("5. 退出");

    const choice = await promptUser("请输入对应数字,按回车确认: ");

    switch (choice) {
      case "1":
        await buildHook();
        break;
      case "2":
        await buildXmindcli();
        break;
      case "3":
        await buildXmindAdmin();
        break;
      case "4":
        await buildXmindApi();
        break;
      case "5":
        console.log("退出");
        process.exit(0); // 退出程序
      default:
        console.log("无效的选择，请重新输入。");
        break;
    }
  }
}

mainMenu(); // 启动菜单
