'use client'

import { cacheFetcher, fetcher } from '@/lib/utils';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PendingIcon from '@mui/icons-material/Pending';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportIcon from '@mui/icons-material/Support';
import { Badge, Divider, Drawer, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useSelectedLayoutSegments } from 'next/navigation';
import useSWR from 'swr';

const LINKS = [
  {
    text: 'Home',
    href: '/',
    icon: HomeIcon,
    targetSegments: ''
  },
  {
    text: 'Pending',
    href: '/workflows/pending',
    icon: PendingIcon,
    targetSegments: 'workflows/pending'
  },
  {
    text: 'Running',
    href: '/workflows/running',
    icon: DirectionsRunIcon,
    targetSegments: 'workflows/running'
  },
  { text: 'Finished', href: '/workflows/finished', icon: DoneIcon, targetSegments: 'workflows/finished' },
  { text: 'Canceled', href: '/workflows/canceled', icon: CancelIcon, targetSegments: 'workflows/canceled' },
  { text: 'Failed', href: '/workflows/failed', icon: ErrorIcon, targetSegments: 'workflows/failed' },
]

const PLACEHOLDER_LINKS = [
  { text: 'Settings', icon: SettingsIcon },
  { text: 'Support', href: '/stats', icon: SupportIcon },
  { text: 'Logout', icon: LogoutIcon },
]

const DRAWER_WIDTH = 240;

const COLOR_MAP = {
  pending: "secondary",
  running: "info",
  finished: "success",
  canceled: "warning",
  failed: "error"
}

function BadgeIcon({icon: Icon, text, data, error}) {
  function getCount(name: string): string | number {
    if (error) return '!'
    if (!data) return '...'
    if (name.toLocaleLowerCase() in data) {
      return data[name.toLowerCase()]
    }
    return 0
  }

  const color = COLOR_MAP[text.toLocaleLowerCase()]
  return (
    <>
      <Badge badgeContent={getCount(text)} color={color ? color : "primary"} sx={{mr: 2}}>
        <Icon />
      </Badge>
    </>
  )
}

export default function SideNav() {
  const segments = useSelectedLayoutSegments().join('/');

  const { data, error } = useSWR('/api/stats/counts', cacheFetcher)

  return (
    <>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: ['48px', '56px', '64px'],
            height: 'auto',
            bottom: 0,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          {LINKS.map(({ text, href, icon: Icon, targetSegments }) => (
            <ListItem key={href} disablePadding>
              <ListItemButton component={Link} href={href} selected={segments === targetSegments}>
                <BadgeIcon icon={Icon} text={text} data={data} error={error}/>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 'auto' }} />
        <List>
          {PLACEHOLDER_LINKS.map(({ text, icon: Icon, href }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} href={href}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )

}
