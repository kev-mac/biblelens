import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {releaseInfo} from './release-info.mjs';
const run=(name,args)=>execFileSync(name,args,{stdio:'inherit'});
const git=args=>execFileSync('git',args,{encoding:'utf8'}).trim();
const flags=new Set(process.argv.slice(2));
if([...flags].some(f=>!['--ios','--install'].includes(f)))throw Error('Supported options: --ios --install');
if(flags.has('--install')&&!flags.has('--ios'))throw Error('--install requires --ios');
if(git(['status','--porcelain']))throw Error('Commit or preserve local edits before preparing a release.');
run('git',['fetch','origin']);
if(git(['rev-list','--count','HEAD..origin/main'])!=='0')throw Error('GitHub has newer commits. Integrate them before releasing.');
const commit=git(['rev-parse','HEAD']);
for(const cmd of [['run','check'],['run','check:sync'],['run','check:release'],['run','build:mobile'],['run','check:mobile']])run('npm',cmd);
const release=JSON.parse(fs.readFileSync('www/release.json','utf8'));
if(release.sourceHash!==releaseInfo().sourceHash)throw Error('Source changed while building. Start the release again.');
if(flags.has('--ios')){
 run(process.execPath,['node_modules/@capacitor/cli/bin/capacitor','sync','ios']);
 run('xcodebuild',['-project','ios/App/App.xcodeproj','-scheme','App','-configuration','Debug','-destination','generic/platform=iOS','-derivedDataPath','.release/ios','-allowProvisioningUpdates','MARKETING_VERSION='+release.version,'CURRENT_PROJECT_VERSION='+git(['rev-list','--count','HEAD']),'build']);
 if(flags.has('--install')){
  run('xcrun',['devicectl','device','install','app','--device','Kevins-iPhone.coredevice.local','.release/ios/Build/Products/Debug-iphoneos/App.app']);
  run('xcrun',['devicectl','device','process','launch','--device','Kevins-iPhone.coredevice.local','--terminate-existing','com.scripturelens.app']);
 }
}
fs.mkdirSync('.release',{recursive:true});fs.writeFileSync('.release/candidate.json',JSON.stringify({canonicalCommit:commit,...release},null,2)+'\n');
console.log('Release candidate ready:',release.version,release.sourceHash.slice(0,12));
console.log('Next: publish the exact prepared dist through the Sites workflow; mirror the canonical source, then run npm run release:verify -- <Sites-checkout>.');
