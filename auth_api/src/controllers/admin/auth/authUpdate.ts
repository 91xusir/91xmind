import { Context } from "hono";

// 获取指定的激活码
export const authUpdate = async (c: Context) => {
  try {
    let { id, deviceCode, tokenCode, expiryTime, isBanned,extra_info } =
      await c.req.json();
    isBanned = isBanned ? isBanned : 0;

    await c.env.DB.prepare(
      "UPDATE tb_auth SET deviceCode = ?1 ,tokenCode= ?2 ,expiryTime = ?3 , isBanned = ?4 , extra_info = ?5 WHERE id = ?6"
    )
      .bind(deviceCode, tokenCode, expiryTime, isBanned,extra_info,id)
      .run();

    return c.json({
      code: 200,
      message: "编辑成功"
    });
  } catch (error) {
    return c.json({
      code: 500,
      message: `${error}`
    });
  }
};
