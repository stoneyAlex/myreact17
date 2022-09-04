/*
 * @Author: shimingxia
 * @Date: 2022-08-24 20:20:52
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-24 20:22:06
 * @Description: 
 */
import { REACT_TEXT } from "./constant";

export function wrapToVdom(element) {
  return typeof element === 'string' || typeof element === 'number' ? {
    type: REACT_TEXT, props: element
  } : element;
}