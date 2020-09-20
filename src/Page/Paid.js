import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Fab,
  withMobileDialog,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Popover,
  Tooltip
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import { withSnackbar } from 'notistack'

axios.defaults.withCredentials = true

const URL = 'http://localhost:8080'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  content: {
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  table: {
    width: '95%',
    margin: '0 auto',
    marginTop: 10
  },
  head: {
    textAlign: 'center',
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 14,
  },
  body: {
    textAlign: 'center',
    fontSize: 14,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  search: {
    position: 'fixed',
    bottom: theme.spacing(14),
    right: theme.spacing(4),
  },
  add: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  span: {
    display: 'inline',
    marginLeft: theme.spacing(2)
  },
  div: {},
  snackbar: {
    position: 'absolute',
  },
  snackbarContent: {
    width: 240,
  },
})

class Paid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      all: [],        // The student list
      Index: 0,       // Currently opened tab
      open: false,    // The dialog (Search/Add)
      id: '',         // The Textfield value in dialogs
      pop: false,     // popover
      login: false,   // User logged-in
    }
    this.changeIndex = this.changeIndex.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePop = this.handlePop.bind(this)
    this.handleClosePop = this.handleClosePop.bind(this)
    this.handlePost = this.handlePost.bind(this)
    this.Year = (new Date().getFullYear() - 1911) - 100 + 4 // 107 -> 11 = 7+4
    this.tab = []
    for (let i = this.Year; i > 4; i -= 1) {
      this.tab.push(`${("0" + i).substr(-2)}級`)
    }
  }
  fetchStudentList() {
    axios.get(`${URL}/_api/students`).then(
      res => this.setState({ all: res.data })
    )
  }
  componentDidMount() {
    if (this.state.login) {
      this.fetchStudentList()
    }
    else {
      axios.post(`${URL}/_api/fee_check`, {}).then(
        res => {
          if (!res.data)
            window.location.href = '/login'
          else {
            this.setState({ login: true })
            this.fetchStudentList()
          }
        }
      ).catch(
        err => {
          window.location.href = '/login'
        }
      )
    }
  }
  changeIndex(e, v) {
    this.setState({ Index: v })
  }
  handleOpen() {
    this.setState({ open: true })
  }
  handlePop() {
    this.setState({ pop: true })
  }
  handleClosePop() {
    this.setState({ pop: false, id: '' })
  }
  handleClose() {
    this.setState({ open: false, id: '' })
  }
  handleChange(e) {
    this.setState({ id: e })
  }
  handlePost() {
    axios.post(`${URL}/_api/pay`, { id: this.state.id.trim() }).then(
      res => {
        this.setState({
          open: false,
          id: ''
        })
        if (res.data.success) {
          const all = this.state.all.map(ele => ({ ...ele }))
          for (let i = 0; i < all.length; i++) {
            if (all[i].id === res.data.id) {
              all[i].paid = 1
              break
            }
          }
          this.setState({
            all: all
          })
          this.props.enqueueSnackbar(`新增成功 id=${res.data.id}`, {
            variant: 'success',
          })
        }
        else {
          this.props.enqueueSnackbar(`新增失敗 id=${res.data.id}`, {
            variant: 'error',
          })
        }
      }
    ).catch(
      err => {
        this.setState({
          open: false,
          id: ''
        })
        this.props.enqueueSnackbar(err.toString(), {
          variant: 'error',
        })
      }
    )
  }
  render() {
    const { classes, fullScreen } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Tabs
            value={this.state.Index}
            onChange={this.changeIndex}
            scrollable="true"
            scrollButtons="on">
            {this.tab.map((tab, index) =>
              <Tab key={index} value={index} label={tab} />
            )}
          </Tabs>
          <Table className={classes.table}>
            <TableHead>
              <TableRow >
                <TableCell className={classes.head}>學號</TableCell>
                <TableCell className={classes.head}>姓名</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.all
                  .filter(student =>
                    (
                      (student.id.length === 7 && student.id.startsWith(("0" + (this.Year - this.state.Index - 4)).substr(-2)))
                      || (student.id.length === 9 && student.id.startsWith(("1" + ("0" + (this.Year - this.state.Index - 4)).substr(-2))))
                    )
                    && (!this.props.filter || student.paid === 1)
                  ).sort((a, b) => a.id.localeCompare(b.id, 'zh-Hant-TW'))
                  .map((student, index) =>
                    <TableRow key={index} className={classes.row}>
                      <TableCell className={classes.body}>{student.id}</TableCell>
                      <TableCell className={classes.body}>{student.name}</TableCell>
                    </TableRow>
                  )
              }
            </TableBody>
          </Table>
        </div>
        <Tooltip title="查詢是否繳費" placement="left">
          <Fab className={classes.search} color="primary" onClick={this.handlePop}
            buttonRef={node => {
              this.anchorEl = node;
            }}>
            <SearchIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="繳費登記" placement="left">
          <Fab className={classes.add} color="secondary" onClick={this.handleOpen}>
            <AddIcon />
          </Fab>
        </Tooltip>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>{"繳費登記"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              此操作會存入資料庫，請確認登記學號姓名是否正確
              </DialogContentText>
            <TextField
              label="學號"
              value={this.state.id}
              onChange={e => this.handleChange(e.target.value)}
              placeholder="請輸入學號"
              margin="normal"
              type='tel'
              autoFocus
              onKeyPress={(e) => { if (e.key === 'Enter') this.handlePost() }}
            />
            <div className={fullScreen ? classes.div : classes.span}>{`${this.state.all.filter(s => s.id === this.state.id.trim()).map(s => `${s.name} (${s.paid ? '已繳費' : '尚未繳費'})`).join('')}`}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              捨棄
            </Button>
            <Button onClick={this.handlePost} color="primary" disabled={this.state.all.some(s => (s.id === this.state.id.trim() && s.paid === 1))}>
              確認
            </Button>
          </DialogActions>
        </Dialog>

        <Popover
          open={this.state.pop}
          anchorEl={this.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={this.handleClosePop}
        >
          <DialogTitle>{"搜尋"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              使用學號搜尋是否有繳交系學會費
              </DialogContentText>
            <TextField
              label="學號"
              value={this.state.id}
              onChange={e => this.handleChange(e.target.value)}
              placeholder="請輸入學號"
              margin="normal"
              type='tel'
              autoFocus
            />
            <div>{`${this.state.all.filter(s => s.id === this.state.id.trim()).map(s => `${s.name} (${s.paid ? '已繳費' : '尚未繳費'})`).join('')}`}</div>
          </DialogContent>
        </Popover>
      </div>
    )
  }
}
const mapState = (state) => ({
  filter: state.filter
})

export default withMobileDialog()(withSnackbar(withStyles(styles)(connect(mapState)(Paid))))