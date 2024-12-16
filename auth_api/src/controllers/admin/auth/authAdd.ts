import { Context } from "hono";

// 获取指定的激活码
export const authAdd = async (c: Context) => {
  try {
    let { deviceCode, tokenCode, expiryTime, isBanned, extra_info } = await c.req.json();
    isBanned = isBanned ? isBanned : 0;
    extra_info = extra_info ? extra_info : "";
    const a = await c.env.DB.prepare("SELECT * FROM tb_auth WHERE deviceCode = ?")
      .bind(deviceCode)
      .first();

    const b = await c.env.DB.prepare("SELECT * FROM tb_auth WHERE tokenCode = ?")
      .bind(tokenCode)
      .first();

    if (a || b) {
      return c.json({
        code: 402,
        message: a ? "设备码已存在" : "授权码已存在"
      });
    }
    const usedTime = new Date().getTime();

    await c.env.DB.prepare(
      "INSERT INTO tb_auth (deviceCode, tokenCode,usedTime,expiryTime,isBanned,extra_info) VALUES (?1, ?2,?3, ?4,?5,?6)"
    )
      .bind(deviceCode, tokenCode, usedTime, expiryTime, isBanned, extra_info)
      .run();

    return c.json({
      code: 200,
      message: "添加成功"
    });
  } catch (error) {
    return c.json({
      code: 500,
      message: `${error}`
    });
  }
};
