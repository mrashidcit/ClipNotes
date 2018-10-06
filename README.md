<p align="center">
  <img src="screenshots/briefnote-hero.png"
    height="auto" width="auto"/>
</p>

<p align="center">
Rapid tags, note taking application for Mac, Windows and Linux
</p>

<p align="center">
  <img src="screenshots/Screen Shot 2018-10-07 at 12.27.44 AM.png"
    height="auto" width="auto"/>
</p>

## Roadmap
### v0.0.1
#### Create new note
- [x] Able to create new note by *pasting TEXT or HTML* from **clipboard**.
- [x] Able to create new note by *pasting a screenshot* from **clipboard**.
- [x] Able to create new note by *pasting an Image* (any format) from **file system**.
#### Tag management
- [x] Able to **create new tag**.
- [x] Able to **assing or remove tag** from selected note.
#### Search by filter
- [X] Able to search notes by **tag filter**.
- ~~[ ] Able to serch notes by **name or description filter**.~~

### v0.0.2
#### Search by filter
- [ ] Able to serch notes by **name or description filter**.
#### Integrations
- [ ] Able to integrate **Dropbox** or **Google Drive**.
- [ ] Able to access application from **Command-line** or **Sockets**.

## Development Instructions
This project is created using [electron-vue](https://github.com/SimulatedGREG/electron-vue) template. Apart from this template and application dependencies, you need to have following setup to start developing/debugging *briefnote* application.
* *Windows* or *OSX* or *Linux* OS platform
* *NodeJs* standard version

## Build Instructions

``` bash
# install dependencies
npm install

# install Platform specific dependencies
npm run platformInstall

# rebuild dependencies for ElectronJs
npm run rebuild-for-electron

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```
---

## License
[MIT](https://opensource.org/licenses/MIT)

## Contact
* [hello@xplorebits.com](mailto:hello@xplorebits.com)
* [saikksub@gmail.com](mailto:hello@xplorebits.com)
