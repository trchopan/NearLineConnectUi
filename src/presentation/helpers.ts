import {format} from 'date-fns'

export const thousandComma = (s: string | number) => {
  return String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const dateFmt = (d: Date, fmt: string = 'yyyy-MM-dd') => format(d, fmt)
export const dateTimeFmt = (d: Date, fmt: string = 'yyyy-MM-dd hh:mm:ss') => format(d, fmt)
