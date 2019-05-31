# Scrapper Tools

This tools is a result of my 2 years of scrapping from various sites. If u like my work please donate me. Contact me shirshak55[@]gmail.com and I will address it within 24 hours.

Currently on develop mode and don't follow semantic versioning

After 2.0.0 it will follow semantic versioning

## Licence

Free for student but costs 20$ for commericial use. Please test and don't ask for refund. $20 should be piece of cake because I know u will get addicted to it :). Once I have stable income I will make it free for commericial too :)

## Handbook

### Goals

- To be Parallel
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

### Debugging Puppetter using monitor

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

### Thanks

Shirshak Bajgain
Google Team, Sindre Sir and dependencies author for their open source.
