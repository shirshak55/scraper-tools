# Scrapper Tools [In Development]

Its in development but I use it in all my web automation project.

After 2.0.0 it will follow semantic versioning

## Handbook

### Mission

- To run bot in parallel
- Minimal Setup
- To Prevent from herustics against bot detection
- Make easy to scrape
- Easy to bypass captcha (Using 2 captcha plugin)
- Using typescript to serve documentation
- VPS friendly so u can scrape over vps like digital ocean or aws without running ur computer

### Examples

There are various opensource and closed source example where this plugin has been used.

1. AliExpress
2. 1668
3. Khan Academy for offline videos

### Sample Example
```bash
mkdir automate-khanacademy
yarn init -y
yarn add scrapper-tools @types/node ts-node typescript
```

Your package.json should look like this
```js
{
  "name": "automate-khanacademy",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "ts-node src/bin.ts",
    "start": "node dist/bin.js",
    "build": "tsc"
  },
  "dependencies": {
    "@types/node": "^12.7.5",
    "scrapper-tools": "^1.0.102",
    "ts-node": "^8.3.0",
    "typescript": "^3.6.3"
  }
}
```

Please modify the scripts so that you can use commands like `yarn dev`, `yarn start` and `yarn build`

This project encourage you to use typescript however Javascript should work fine too.

So create tsconfig.json file with following content.
```
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true,
    "jsx": "react",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "lib": ["dom", "esnext", "es2015", "es2016", "es2017", "es2018"]
  },
  "exclude": ["node_modules"],
  "include": ["src/bin.ts"]
}
```

I have created folder src and created src/bin.ts file which will contain automation/scraping logic.

Here is sample `src/bin.ts` file.

```js
import {fastPage} from 'scrapper-tools'
import path from 'path'


async function main(){
  // You can change many other settings like using 2tickets  api key to bypass captcha, width ,height etc. All of the following config are optional so don't worry if you don't use them
  await fastPage.setUserDataDir(path.join(__dirname, '/../.userDataDir'))
  await fastPage.setWindowSizeArg({ width: 1660, height: 960 })
  await fastPage.setDefaultNavigationTimeout(120 * 1000)
  await fastPage.setHeadless(false)

  let page = await fastPage.newPage()

  await page.goto('https://khanacademy.com',{waitUntill: 'networkidle2'})
  await page.close()


  // At the end don't forget to close browser
   await fastPage.closeBrowser()
}
```

I recommend you to use prettier and eslint to make code super clear and bug free.

If you want this project to move way to forward please consider donations which can be found in the end of the page.


## Intresting Findings.

### Debugging Puppetter using monitor

In linux machine with cli you cannot see browser? Yeah I also used to think same but no more. You can use virtual monitor and use remote viewer to see browser. Isn't it cool?

Install xvfb

```bash
sudo apt-get install xvfb
```

Test running google chrome

```bash
DISPLAY=:99 google-chrome --no-sandbox
```

```bash
Xvfb :99 &
DISPLAY=:99 xvfb-run --server-args='-screen 0 1024x768x24' yarn start
```

### Using VNC Server

Install tightvnc

```bash
sudo apt install tightvncserver
```

Start the vnc server port screen 99 lets say
/usr/bin/tightvncserver :99

On LocalPC use SSH Tunnel

```bash
ssh -L 5999:127.0.0.1:5999 -N -f -l username remote_ip
brew install tiger-vnc
vncviewer 127.0.0.1:5999
```

Now run script using that screen

```bash
DISPLAY=:99 yarn start
```

On Remote PC

## Injecting Functions

I have added inject function like waiting for dom element etc which is not available in evaluation script (page.evaluate function). 

```js
import { functionsToInject } from 'scrapper-tools'
await page.addScriptTag({
  content: `${functionsToInject.waitForElement} ${
    functionsToInject.waitForElementToBeRemoved
  } ${functionsToInject.delay}`,
})
```

## Licence
MIT Licence 

## Support
Please support me by sending payment to https://www.paypal.me/KGajurel. Please inform me if you have helped me.

### Thanks

Shirshak Bajgain
Google Team, Sindre Sir and dependencies author for their open source.
