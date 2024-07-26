import useLanguage from '@/locale/useLanguage';

import { useEffect } from 'react';

import { Layout, Col, Divider, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';
import SelectLanguage from '@/components/SelectLanguage';

import '@/myCSS/myDynamicBackground.css';

import logo from '@/style/images/idurar-crm-erp.svg';
import { redirect } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE }) => {
  const translate = useLanguage();

  useEffect(() => {
    const MIN_SPEED = 0.5;
    const MAX_SPEED = 2;

    function randomNumber(min, max) {
      return Math.random() * (max - min) + min;
    }

    class Blob {
      constructor(el) {
        this.el = el;
        const boundingRect = this.el.getBoundingClientRect();
        this.size = boundingRect.width;
        this.initialX = randomNumber(0, window.innerWidth - this.size);
        this.initialY = randomNumber(0, window.innerHeight - this.size);
        this.el.style.top = `${this.initialY}px`;
        this.el.style.left = `${this.initialX}px`;
        this.vx =
          randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        this.vy =
          randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        this.x = this.initialX;
        this.y = this.initialY;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x >= window.innerWidth - this.size) {
          this.x = window.innerWidth - this.size;
          this.vx *= -1;
        }
        if (this.y >= window.innerHeight - this.size) {
          this.y = window.innerHeight - this.size;
          this.vy *= -1;
        }
        if (this.x <= 0) {
          this.x = 0;
          this.vx *= -1;
        }
        if (this.y <= 0) {
          this.y = 0;
          this.vy *= -1;
        }

        this.el.style.transform = `translate(${this.x - this.initialX}px, ${this.y - this.initialY}px)`;
      }
    }

    function initBlobs() {
      const blobEls = document.querySelectorAll('.blob');
      const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl));

      function update() {
        requestAnimationFrame(update);
        blobs.forEach((blob) => blob.update());
      }
      requestAnimationFrame(update);
    }

    initBlobs();
  }, []);

  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          // padding: '80px 30px 30px',
          padding: '10px 20px',
          // maxWidth: '440px',
          // margin: '0 auto',
          // background: 'red',
          zIndex: 9
        }}
      >
        <div className="blobs">
          <div className="blob"></div>
          <div className="blob"></div>
          <div className="blob"></div>
          <div className="blob"></div>
          <div className="blob"></div>
          <div className="blob"></div>
          <div className="blob"></div>
        </div>
        <SelectLanguage />

        <div className="site-layout-content">{authContent}</div>
      </Content>
      {/* <div className="blobs">
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
      <div className="site-layout-content">{authContent}</div> */}
    </AuthLayout>
  );
};

export default AuthModule;
