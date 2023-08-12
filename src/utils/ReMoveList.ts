import { UserData } from "../type/ReduxType";

export const removeList = (
  data: UserData,
  key: string,
  dateArray: string[]
) => {
  for (const item of dateArray) {
    console.log(item);
    delete data[item][key];
  }
  return data;
};
