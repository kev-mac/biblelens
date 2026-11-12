// Only an explicit appFont is app-wide. Legacy reading-only keys remain data.
export const APP_FONTS=Object.freeze({inter:'"Inter",system-ui,sans-serif',lora:'"Lora",Georgia,serif',georgia:'Georgia,serif',system:'system-ui,sans-serif',mono:'ui-monospace,monospace'});
export function resolveAppFont(preferences,fallback=null){
 const choice=preferences?.appFont;
 const key=Object.hasOwn(APP_FONTS,choice)?choice:Object.hasOwn(APP_FONTS,fallback)?fallback:null;
 return key===null?null:{key,family:APP_FONTS[key]};
}
export function applyAppFont(style,preferences,{fallback=null,properties=['--ui-font']}={}){
 const font=resolveAppFont(preferences,fallback);
 if(font)for(const property of properties)style.setProperty(property,font.family);
 return font?.key??null;
}
