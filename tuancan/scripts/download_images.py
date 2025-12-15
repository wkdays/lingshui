# -*- coding: utf-8 -*-
"""
使用 Selenium + 百度图片 下载团餐小程序所需图片资源
"""

import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 图片保存目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, 'static', 'images')

# 需要下载的图片列表
IMAGES_TO_DOWNLOAD = [
    # 轮播图
    {'keyword': '机关食堂 营养配餐', 'filename': 'banner1.png', 'count': 1},
    {'keyword': '职工餐厅 团餐', 'filename': 'banner2.png', 'count': 1},
    {'keyword': '便民服务 在线订餐', 'filename': 'banner3.png', 'count': 1},
    
    # 商家logo
    {'keyword': '中央厨房 logo', 'filename': 'shop1.png', 'count': 1},
    {'keyword': '健康轻食 logo', 'filename': 'shop2.png', 'count': 1},
    {'keyword': '家常菜馆 logo', 'filename': 'shop3.png', 'count': 1},
    
    # 菜品图片
    {'keyword': '米饭套餐 美食', 'filename': 'food1.png', 'count': 1},
    {'keyword': '咖喱炒饭 美食', 'filename': 'food2.png', 'count': 1},
    {'keyword': '蛋炒饭 美食', 'filename': 'food3.png', 'count': 1},
    {'keyword': '米饭便当 美食', 'filename': 'food4.png', 'count': 1},
    {'keyword': '印度薄饼 美食', 'filename': 'food5.png', 'count': 1},
    {'keyword': '海鲜炒饭 美食', 'filename': 'food6.png', 'count': 1},
    {'keyword': '咖喱鸡肉饭 美食', 'filename': 'food7.png', 'count': 1},
    {'keyword': '什锦炒饭 美食', 'filename': 'food8.png', 'count': 1},
    
    # 用户头像
    {'keyword': '默认头像 用户', 'filename': 'default-avatar.png', 'count': 1},
]


def setup_driver():
    """配置并启动Chrome浏览器"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # 无头模式
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver


def search_baidu_image(driver, keyword):
    """在百度图片搜索关键词"""
    url = f'https://image.baidu.com/search/index?tn=baiduimage&word={keyword}'
    driver.get(url)
    time.sleep(2)
    return driver


def get_image_urls(driver, count=1):
    """获取搜索结果中的图片URL"""
    image_urls = []
    try:
        # 等待图片加载
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'img.main_img'))
        )
        
        # 获取图片元素
        images = driver.find_elements(By.CSS_SELECTOR, 'img.main_img')
        
        for img in images[:count]:
            src = img.get_attribute('src')
            if src and src.startswith('http'):
                image_urls.append(src)
    except Exception as e:
        print(f'获取图片URL失败: {e}')
    
    return image_urls


def download_image(url, filepath):
    """下载图片到指定路径"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://image.baidu.com/'
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f'✓ 下载成功: {filepath}')
            return True
    except Exception as e:
        print(f'✗ 下载失败: {filepath}, 错误: {e}')
    return False


def main():
    """主函数"""
    print('=' * 50)
    print('团餐小程序图片资源下载工具')
    print('=' * 50)
    
    # 确保目录存在
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    # 启动浏览器
    print('\n正在启动浏览器...')
    driver = setup_driver()
    
    try:
        success_count = 0
        fail_count = 0
        
        for item in IMAGES_TO_DOWNLOAD:
            keyword = item['keyword']
            filename = item['filename']
            count = item['count']
            filepath = os.path.join(IMAGES_DIR, filename)
            
            # 检查文件是否已存在
            if os.path.exists(filepath):
                print(f'⊙ 已存在: {filename}')
                success_count += 1
                continue
            
            print(f'\n搜索: {keyword}')
            search_baidu_image(driver, keyword)
            
            urls = get_image_urls(driver, count)
            if urls:
                for url in urls:
                    if download_image(url, filepath):
                        success_count += 1
                        break
                else:
                    fail_count += 1
            else:
                print(f'✗ 未找到图片: {keyword}')
                fail_count += 1
            
            time.sleep(1)  # 避免请求过快
        
        print('\n' + '=' * 50)
        print(f'下载完成! 成功: {success_count}, 失败: {fail_count}')
        print(f'图片保存目录: {IMAGES_DIR}')
        print('=' * 50)
        
    finally:
        driver.quit()


if __name__ == '__main__':
    main()
