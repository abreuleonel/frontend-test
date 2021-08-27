import buildFullUrl from '../buildFullUrl'
import { snakeCase, kebabCase } from '../helpers'

const baseUrl = 'https://seasoned.cc'
describe('buildFullUrl', () => {  
  describe('when query is given', () => {
    it('tags and ends with &', () => {
        //https://seasoned.cc/fake-path/2/resource?tags[]=fake&tags[]=path&at-page=2&
        const buildedUrl = buildFullUrl({
            baseUrl: 'https://seasoned.cc/',
            name: 'resource',
            id: 2,
            customPath: '/fake-path/:id/resource',
            queryStringParser: kebabCase,
            query: {
              tags: ['fake', 'path'],
              atPage: 2,
              nan: NaN,
              null: null,
              undef: undefined,
            },
          })
//        console.log("build", buildedUrl)
      expect(
        buildedUrl,
      ).toBe(`${baseUrl}/fake-path/2/resource?tags[]=fake&tags[]=path&at-page=2`)
    })
  })
})
